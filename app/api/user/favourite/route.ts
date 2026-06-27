import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyJWT } from "@/lib/auth";
import { ApiResponse } from "@/lib/types";

async function authenticateRequest(
  request: NextRequest,
  env: any
): Promise<number | null> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyJWT(token, env.JWT_SECRET as string);
  return payload?.userId ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();

    const userId = await authenticateRequest(request, env);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    // Fetch favourite club
    const favourite = await env.DB.prepare(
      "SELECT club_id FROM user_favourites WHERE user_id = ?"
    )
      .bind(userId)
      .first();

    return NextResponse.json(
      {
        success: true,
        data: { clubId: favourite?.club_id ?? null },
      } as ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Get favourite error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { env } = getCloudflareContext();

    const userId = await authenticateRequest(request, env);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } as ApiResponse<null>,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { clubId } = body;

    if (!clubId) {
      return NextResponse.json(
        { success: false, error: "clubId is required" } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Upsert favourite (INSERT OR REPLACE)
    await env.DB.prepare(
      "INSERT OR REPLACE INTO user_favourites (user_id, club_id) VALUES (?, ?)"
    )
      .bind(userId, clubId)
      .run();

    return NextResponse.json(
      {
        success: true,
        data: { clubId },
      } as ApiResponse<any>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Update favourite error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
