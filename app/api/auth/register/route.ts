import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hashPassword, createJWT } from "@/lib/auth";
import { ApiResponse, User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();

    const body = (await request.json()) as { email: string; username: string; password: string };
    const { email, username, password } = body;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, username, and password are required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Username must be at least 3 characters",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await env.DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    )
      .bind(email)
      .first();

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Email already exists" } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await env.DB.prepare(
      "SELECT id FROM users WHERE username = ?"
    )
      .bind(username)
      .first();

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          error: "Username already exists",
        } as ApiResponse<null>,
        { status: 409 }
      );
    }

    // Hash password
    const { hash: passwordHash, salt: passwordSalt } =
      await hashPassword(password);

    // Insert user into database
    const newUser = await env.DB.prepare(
      "INSERT INTO users (email, username, password_hash, password_salt) VALUES (?, ?, ?, ?) RETURNING *"
    )
      .bind(email, username, passwordHash, passwordSalt)
      .first();

    if (!newUser) {
      return NextResponse.json(
        { success: false, error: "Failed to create user" } as ApiResponse<null>,
        { status: 500 }
      );
    }

    const user: User = {
      id: newUser.id as number,
      email: newUser.email as string,
      username: newUser.username as string,
      created_at: newUser.created_at as string,
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
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 604800,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
