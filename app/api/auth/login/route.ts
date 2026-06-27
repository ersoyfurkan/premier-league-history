import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyPassword, createJWT } from "@/lib/auth";
import { ApiResponse, User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();

    const body = (await request.json()) as { email: string; password: string };
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Find user by email
    const dbUser = await env.DB.prepare(
      "SELECT * FROM users WHERE email = ?"
    )
      .bind(email)
      .first();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      password,
      dbUser.password_hash as string,
      dbUser.password_salt as string
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const user: User = {
      id: dbUser.id as number,
      email: dbUser.email as string,
      username: dbUser.username as string,
      created_at: dbUser.created_at as string,
    };

    // Create JWT
    const token = await createJWT(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      env.JWT_SECRET as string
    );

    // Create response with Set-Cookie header
    const response = NextResponse.json(
      { success: true, data: user } as ApiResponse<User>,
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 604800,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
