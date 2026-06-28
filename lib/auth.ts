import { SignJWT, jwtVerify } from "jose";

function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return new Uint8Array(bytes);
}

export async function hashPassword(
  password: string
): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash: hashHex, salt: saltHex };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const saltBytes = new Uint8Array(salt.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === hash;
}

export async function createJWT(
  payload: { userId: number; email: string; username: string },
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60;

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(secretKey);

  return token;
}

export async function verifyJWT(
  token: string,
  secret: string
): Promise<{ userId: number; email: string; username: string } | null> {
  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    const verified = await jwtVerify(token, secretKey);
    const { userId, email, username } = verified.payload as any;
    const parsedUserId = Number(userId);

    if (
      userId === undefined ||
      userId === null ||
      !email ||
      !username ||
      Number.isNaN(parsedUserId)
    ) {
      return null;
    }

    return { userId: parsedUserId, email, username };
  } catch {
    return null;
  }
}
