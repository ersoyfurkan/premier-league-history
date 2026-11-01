import { NextRequest } from "next/server";
import { leagueApi } from "@/lib/leagueApi";

export const GET = (request: NextRequest) => leagueApi(request, "superlig");
