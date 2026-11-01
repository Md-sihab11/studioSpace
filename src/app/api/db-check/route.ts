import { NextResponse } from "next/server";
import { checkDBConnection } from "@/lib/db";

export async function GET() {
  try {
    await checkDBConnection();

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
