import { SignJWT, jwtVerify } from "jose";

function bufferToHex(buffer: ArrayBuffer): string {
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
  const saltBuffer = crypto.getRandomValues(new Uint8Array(16));
  const salt = bufferToHex(saltBuffer);

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const hash = bufferToHex(hashBuffer);

  return { hash, salt };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const saltBuffer = hexToBuffer(salt);

  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const computedHash = bufferToHex(hashBuffer);
  return computedHash === hash;
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

    if (!userId || !email || !username) {
      return null;
    }

    return { userId: Number(userId), email, username };
  } catch {
    return null;
  }
}
