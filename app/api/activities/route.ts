import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "demo-user-id";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const { searchParams } = new URL(request.url);
    const trackerId = searchParams.get("trackerId");

    if (!trackerId) {
      return NextResponse.json({ error: "trackerId is required" }, { status: 400 });
    }

    const activities = await prisma.dailyActivity.findMany({
      where: {
        userId,
        trackerId,
      },
      select: {
        date: true,
        count: true,
        entryCount: true,
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const body = await request.json();
    const { trackerId, date, count } = body;

    if (!trackerId || !date) {
      return NextResponse.json({ error: "trackerId and date are required" }, { status: 400 });
    }

    // Toggle intensity level or set explicit count
    const existing = await prisma.dailyActivity.findUnique({
      where: {
        trackerId_date: {
          trackerId,
          date,
        },
      },
    });

    let newCount = count;
    if (newCount === undefined) {
      // Rotate 0 -> 1 -> 2 -> 3 -> 0
      const currentLevel = existing ? existing.count : 0;
      newCount = (currentLevel + 1) % 4;
    }

    const updated = await prisma.dailyActivity.upsert({
      where: {
        trackerId_date: {
          trackerId,
          date,
        },
      },
      create: {
        userId,
        trackerId,
        date,
        count: newCount,
        entryCount: newCount > 0 ? 1 : 0,
      },
      update: {
        count: newCount,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/activities error:", error);
    return NextResponse.json({ error: "Failed to update daily cell activity" }, { status: 500 });
  }
}
