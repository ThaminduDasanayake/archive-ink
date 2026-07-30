import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "demo-user-id";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    // Ensure default tracker exists
    let trackers = await prisma.tracker.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    if (trackers.length === 0) {
      const defaultTracker = await prisma.tracker.create({
        data: {
          userId,
          title: "Writing Velocity",
          colorScheme: "emerald",
          metricType: "AUTO_NOTE",
          isDefault: true,
        },
      });
      trackers = [defaultTracker];
    }

    return NextResponse.json(trackers);
  } catch (error) {
    console.error("GET /api/trackers error:", error);
    return NextResponse.json({ error: "Failed to fetch trackers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const body = await request.json();
    const { title, tag, colorScheme = "emerald", metricType = "AUTO_NOTE" } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const tracker = await prisma.tracker.create({
      data: {
        userId,
        title: title.trim(),
        tag: tag ? tag.trim().replace(/^#/, "").toLowerCase() : null,
        colorScheme,
        metricType,
        isDefault: false,
      },
    });

    return NextResponse.json(tracker, { status: 201 });
  } catch (error) {
    console.error("POST /api/trackers error:", error);
    return NextResponse.json({ error: "Failed to create tracker" }, { status: 500 });
  }
}
