import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true },
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
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}