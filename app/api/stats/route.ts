import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format, subDays, parseISO } from "date-fns";

const DEMO_USER_ID = "demo-user-id";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id || DEMO_USER_ID;

    const defaultTracker = await prisma.tracker.findFirst({
      where: { userId, isDefault: true },
    });

    if (!defaultTracker) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalWords: 0,
        activeDaysCount: 0,
      });
    }

    const activities = await prisma.dailyActivity.findMany({
      where: {
        userId,
        trackerId: defaultTracker.id,
        count: { gt: 0 },
      },
      orderBy: { date: "asc" },
    });

    const activeDatesSet = new Set(activities.map((a: { date: string }) => a.date));
    const totalWords = activities.reduce(
      (acc: number, curr: { count: number }) => acc + curr.count,
      0
    );

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

    let currentStreak = 0;
    let checkDate: Date | null = activeDatesSet.has(todayStr)
      ? new Date()
      : activeDatesSet.has(yesterdayStr)
        ? subDays(new Date(), 1)
        : null;

    if (checkDate) {
      while (true) {
        const dateStr = format(checkDate, "yyyy-MM-dd");
        if (activeDatesSet.has(dateStr)) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }

    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Array.from(activeDatesSet).sort();

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = parseISO(sortedDates[i - 1]);
        const currDate = parseISO(sortedDates[i]);
        const diffInDays = Math.round(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
        );

        if (diffInDays === 1) {
          tempStreak++;
        } else if (diffInDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    return NextResponse.json({
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalWords,
      activeDaysCount: activeDatesSet.size,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 });
  }
}
