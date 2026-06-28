import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const { env } = getCloudflareContext();

  const isAdmin = await verifyAdminToken(request, env);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await env.DB.prepare(
    `SELECT
      users.id,
      users.username,
      users.email,
      users.created_at,
      user_favourites.club_id AS favouriteClubId
    FROM users
    LEFT JOIN user_favourites ON user_favourites.user_id = users.id`
  ).all();

  return NextResponse.json(result.results ?? [], { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { env } = getCloudflareContext();

  const isAdmin = await verifyAdminToken(request, env);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { userId: number };
  const { userId } = body;

  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();

  return NextResponse.json({ success: true }, { status: 200 });
}
