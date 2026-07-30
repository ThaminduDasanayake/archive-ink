import { PrismaClient } from "@prisma/client";
import { subDays, format } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Archive Ink database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { id: "demo-user-id" },
    update: {},
    create: {
      id: "demo-user-id",
      name: "Archive Writer",
      email: "demo@archiveink.dev",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=ArchiveInk",
    },
  });

  // Create default Writing Velocity tracker
  const defaultTracker = await prisma.tracker.upsert({
    where: { id: "default-tracker-id" },
    update: {},
    create: {
      id: "default-tracker-id",
      userId: user.id,
      title: "Writing Velocity",
      colorScheme: "emerald",
      metricType: "AUTO_NOTE",
      isDefault: true,
    },
  });

  // Create custom Morning Pages tracker (Violet theme)
  const morningTracker = await prisma.tracker.upsert({
    where: { id: "morning-tracker-id" },
    update: {},
    create: {
      id: "morning-tracker-id",
      userId: user.id,
      title: "Morning Pages",
      tag: "morning-pages",
      colorScheme: "violet",
      metricType: "AUTO_NOTE",
      isDefault: false,
    },
  });

  // Create custom Code & Dev Notes tracker (Sky theme)
  const codeTracker = await prisma.tracker.upsert({
    where: { id: "code-tracker-id" },
    update: {},
    create: {
      id: "code-tracker-id",
      userId: user.id,
      title: "Code & Architecture Notes",
      tag: "dev",
      colorScheme: "sky",
      metricType: "AUTO_NOTE",
      isDefault: false,
    },
  });

  console.log("Created Trackers:", defaultTracker.title, morningTracker.title, codeTracker.title);

  // Generate 60 days of sample entries and activity heatmaps
  const today = new Date();
  const sampleNotes = [
    {
      title: "Building Archive Ink Blueprint",
      content: "Today we designed the complete architecture for Archive Ink. Using Next.js 16, Prisma ORM, and handwritten typography. #dev #reflection",
      tags: ["dev", "reflection"],
    },
    {
      title: "Morning Thoughts & Intentions",
      content: "Sunlight hitting the desk. Setting 3 main intentions for the day: 1. Deep focus work, 2. Afternoon walk, 3. Read 30 pages. #morning-pages",
      tags: ["morning-pages"],
    },
    {
      title: "React 19 & Next.js 16 App Router Notes",
      content: "Explored Server Actions and live preview rendering for lightweight markup editors. Highly performant. #dev",
      tags: ["dev"],
    },
    {
      title: "Evening Reflection",
      content: "A peaceful end to the day. Grateful for clarity of thought and steady habit building. #reflection",
      tags: ["reflection"],
    },
  ];

  for (let i = 0; i < 60; i += 2) {
    const entryDate = format(subDays(today, i), "yyyy-MM-dd");
    const template = sampleNotes[i % sampleNotes.length];
    const wordCount = 150 + Math.floor(Math.random() * 400);

    // Create sample note
    await prisma.note.create({
      data: {
        userId: user.id,
        title: `${template.title} (${entryDate})`,
        content: template.content,
        wordCount,
        tags: template.tags,
        date: entryDate,
      },
    });

    // Create activity record for default tracker
    await prisma.dailyActivity.upsert({
      where: {
        trackerId_date: {
          trackerId: defaultTracker.id,
          date: entryDate,
        },
      },
      create: {
        userId: user.id,
        trackerId: defaultTracker.id,
        date: entryDate,
        count: wordCount,
        entryCount: 1,
      },
      update: {
        count: { increment: wordCount },
        entryCount: { increment: 1 },
      },
    });

    // If tag matches morning pages or dev, update custom tracker
    if (template.tags.includes("morning-pages")) {
      await prisma.dailyActivity.upsert({
        where: {
          trackerId_date: {
            trackerId: morningTracker.id,
            date: entryDate,
          },
        },
        create: {
          userId: user.id,
          trackerId: morningTracker.id,
          date: entryDate,
          count: wordCount,
          entryCount: 1,
        },
        update: {
          count: { increment: wordCount },
          entryCount: { increment: 1 },
        },
      });
    }

    if (template.tags.includes("dev")) {
      await prisma.dailyActivity.upsert({
        where: {
          trackerId_date: {
            trackerId: codeTracker.id,
            date: entryDate,
          },
        },
        create: {
          userId: user.id,
          trackerId: codeTracker.id,
          date: entryDate,
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

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
