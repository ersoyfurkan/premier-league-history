import { verifyJWT } from "@/lib/auth";

export async function verifyAdminToken(
  request: Request,
  env: CloudflareEnv
): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  const tokenMatch = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("admin_token="));

  if (!tokenMatch) {
    return false;
  }

  const token = tokenMatch.substring("admin_token=".length);

  if (!token) {
    return false;
  }

  const payload = await verifyJWT(token, env.JWT_SECRET);

  if (payload === null) {
    return false;
  }

  return payload.email === "admin";
}
