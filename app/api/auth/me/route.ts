import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";
import { ApiResponse, User } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();

    // Read token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Verify JWT
    const payload = await verifyJWT(token, env.JWT_SECRET as string);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Fetch user from database
    const dbUser = await env.DB.prepare(
      "SELECT id, email, username, created_at FROM users WHERE id = ?"
    )
      .bind(payload.userId)
      .first();

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" } as ApiResponse<null>,
        { status: 404 }
      );
    }

    const user: User = {
      id: dbUser.id as number,
      email: dbUser.email as string,
      username: dbUser.username as string,
      created_at: dbUser.created_at as string,
    };

    // Fetch favourite club
    const favourite = await env.DB.prepare(
      "SELECT club_id FROM user_favourites WHERE user_id = ?"
    )
      .bind(payload.userId)
      .first();

    const response = {
      ...user,
      favouriteClubId: favourite?.club_id ?? null,
    };

    return NextResponse.json(
      { success: true, data: response } as ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Me endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
