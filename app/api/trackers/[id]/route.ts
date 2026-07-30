import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "demo-user-id";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const tracker = await prisma.tracker.findFirst({
      where: { id, userId },
    });

    if (!tracker) {
      return NextResponse.json({ error: "Tracker not found" }, { status: 404 });
    }

    if (tracker.isDefault) {
      return NextResponse.json({ error: "Cannot delete the default tracker" }, { status: 400 });
    }

    await prisma.tracker.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/trackers/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete tracker" }, { status: 500 });
  }
}
