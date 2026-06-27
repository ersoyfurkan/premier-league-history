import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, data: { message: "Logged out successfully" } } as ApiResponse<null>,
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
