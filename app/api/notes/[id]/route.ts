import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateWordCount, extractTags } from "@/lib/utils";

const DEMO_USER_ID = "demo-user-id";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, tags: inputTags } = body;

    const newWordCount = calculateWordCount(content);
    const wordCountDelta = newWordCount - existingNote.wordCount;
    const extracted = extractTags(content + " " + ((inputTags || []).join(" ") || ""));
    const finalTags = Array.from(new Set(extracted));

    const updatedNote = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const note = await tx.note.update({
        where: { id },
        data: {
          title: title !== undefined ? title : existingNote.title,
          content: content !== undefined ? content : existingNote.content,
          wordCount: newWordCount,
          tags: finalTags,
        },
      });

      if (wordCountDelta !== 0) {
        const userTrackers = await tx.tracker.findMany({
          where: { userId },
        });

        for (const tracker of userTrackers) {
          const isMatched =
            tracker.isDefault || (tracker.tag && finalTags.includes(tracker.tag.toLowerCase()));
          if (isMatched) {
            await tx.dailyActivity.upsert({
              where: {
                trackerId_date: {
                  trackerId: tracker.id,
                  date: existingNote.date,
                },
              },
              create: {
                userId,
                trackerId: tracker.id,
                date: existingNote.date,
                count: Math.max(0, newWordCount),
                entryCount: 1,
              },
              update: {
                count: { increment: wordCountDelta },
              },
            });
          }
        }
      }

      return note;
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("PUT /api/notes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const existingNote = await prisma.note.findUnique({
      where: { id },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.note.delete({ where: { id } });

      const userTrackers = await tx.tracker.findMany({ where: { userId } });

      for (const tracker of userTrackers) {
        const isMatched =
          tracker.isDefault ||
          (tracker.tag && existingNote.tags.includes(tracker.tag.toLowerCase()));
        if (isMatched) {
          const activity = await tx.dailyActivity.findUnique({
            where: {
              trackerId_date: {
                trackerId: tracker.id,
                date: existingNote.date,
              },
            },
          });

          if (activity) {
            const newCount = Math.max(0, activity.count - existingNote.wordCount);
            const newEntries = Math.max(0, activity.entryCount - 1);

            if (newEntries === 0 && newCount === 0) {
              await tx.dailyActivity.delete({ where: { id: activity.id } });
            } else {
              await tx.dailyActivity.update({
                where: { id: activity.id },
                data: { count: newCount, entryCount: newEntries },
              });
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
