import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const { env } = getCloudflareContext();

  const isAdmin = await verifyAdminToken(request, env);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [usersResult, favouritesResult, topClubsResult] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) as count FROM users").first(),
    env.DB.prepare("SELECT COUNT(*) as count FROM user_favourites").first(),
    env.DB.prepare(
      "SELECT club_id, COUNT(*) as count FROM user_favourites GROUP BY club_id ORDER BY count DESC LIMIT 5"
    ).all(),
  ]);

  return NextResponse.json(
    {
      totalUsers: Number(usersResult?.count ?? 0),
      totalFavourites: Number(favouritesResult?.count ?? 0),
      topClubs: (topClubsResult.results ?? []).map((row) => ({
        club_id: row.club_id,
        count: Number(row.count),
      })),
    },
    { status: 200 }
  );
}
