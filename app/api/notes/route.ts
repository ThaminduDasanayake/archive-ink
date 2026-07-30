import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateWordCount, extractTags, getTodayDateString } from "@/lib/utils";

const DEMO_USER_ID = "demo-user-id";

async function getOrCreateUser(sessionUserId?: string) {
  const targetId = sessionUserId || DEMO_USER_ID;
  const existingUser = await prisma.user.findUnique({ where: { id: targetId } });
  if (existingUser) return existingUser;

  return await prisma.user.create({
    data: {
      id: targetId,
      name: sessionUserId ? "Logged User" : "Archive Writer",
      email: sessionUserId ? "user@example.com" : "demo@archiveink.dev",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=ArchiveInk",
    },
  });
}

async function ensureDefaultTracker(userId: string) {
  const defaultTracker = await prisma.tracker.findFirst({
    where: { userId, isDefault: true },
  });

  if (defaultTracker) return defaultTracker;

  return await prisma.tracker.create({
    data: {
      userId,
      title: "Writing Velocity",
      colorScheme: "emerald",
      metricType: "AUTO_NOTE",
      isDefault: true,
    },
  });
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;
    await getOrCreateUser(userId);

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const date = searchParams.get("date");

    const where: Prisma.NoteWhereInput = { userId };

    if (tag) {
      where.tags = { has: tag.toLowerCase() };
    }

    if (date) {
      where.date = date;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;
    const user = await getOrCreateUser(userId);
    await ensureDefaultTracker(user.id);

    const body = await request.json();
    const {
      title = "Untitled Entry",
      content = "",
      date = getTodayDateString(),
      tags: inputTags = [],
    } = body;

    const wordCount = calculateWordCount(content);
    const extracted = extractTags(content + " " + (inputTags.join(" ") || ""));
    const finalTags = Array.from(new Set(extracted));

    const note = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newNote = await tx.note.create({
        data: {
          userId: user.id,
          title: title.trim() || "Untitled Entry",
          content,
          wordCount,
          tags: finalTags,
          date,
        },
      });

      const userTrackers = await tx.tracker.findMany({
        where: { userId: user.id },
      });

      for (const tracker of userTrackers) {
        const isMatched =
          tracker.isDefault || (tracker.tag && finalTags.includes(tracker.tag.toLowerCase()));

        if (isMatched) {
          await tx.dailyActivity.upsert({
            where: {
              trackerId_date: {
                trackerId: tracker.id,
                date,
              },
            },
            create: {
              userId: user.id,
              trackerId: tracker.id,
              date,
              count: wordCount,
              entryCount: 1,
            },
            update: {
              count: { increment: wordCount },
              entryCount: { increment: 1 },
            },
          });
        }
      }

      return newNote;
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
