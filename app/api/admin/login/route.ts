import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createJWT } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { username: string; password: string };
  const { username, password } = body;

  const { env } = getCloudflareContext();
  const adminUsername = env.ADMIN_USERNAME as string;
  const adminPassword = env.ADMIN_PASSWORD as string;

  if (username !== adminUsername || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createJWT(
    { userId: 0, email: "admin", username: "admin" },
    env.JWT_SECRET as string
  );

  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set("admin_token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 3600,
});

  return response;
}
