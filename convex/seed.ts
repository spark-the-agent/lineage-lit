import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Seed data migration from mock data
// Run this once to populate the database

const seedCreators = [
  {
    name: "Ernest Hemingway",
    slug: "hemingway",
    years: "1899–1961",
    bio: "American novelist and short story writer, known for his terse prose and the 'iceberg theory'.",
    birthYear: 1899,
    deathYear: 1961,
    nationality: "American",
    influencedBy: [] as string[],
    influenced: ["carver", "mccarthy"],
    works: [
      {
        title: "The Sun Also Rises",
        slug: "sun-also-rises",
        year: 1926,
        type: "book" as const,
        description: "Lost Generation classic",
      },
      {
        title: "The Old Man and the Sea",
        slug: "old-man-sea",
        year: 1952,
        type: "book" as const,
        description: "Pulitzer Prize winner",
      },
    ],
  },
  {
    name: "Raymond Carver",
    slug: "carver",
    years: "1938–1988",
    bio: "American short story writer and poet, master of minimalism and the 'dirty realist' school.",
    birthYear: 1938,
    deathYear: 1988,
    nationality: "American",
    influencedBy: ["hemingway"],
    influenced: ["wolff"],
    works: [
      {
        title: "What We Talk About When We Talk About Love",
        slug: "what-we-talk-about",
        year: 1981,
        type: "book" as const,
        description: "Minimalist masterpiece",
      },
      {
        title: "Cathedral",
        slug: "cathedral",
        year: 1983,
        type: "book" as const,
        description: "Later, more expansive work",
      },
    ],
  },
  {
    name: "Cormac McCarthy",
    slug: "mccarthy",
    years: "1933–2023",
    bio: "American novelist known for his sparse prose and violent, biblical themes.",
    birthYear: 1933,
    deathYear: 2023,
    nationality: "American",
    influencedBy: ["hemingway", "faulkner"],
    influenced: [] as string[],
    works: [
      {
        title: "Blood Meridian",
        slug: "blood-meridian",
        year: 1985,
        type: "book" as const,
        description: "Violent Western epic",
      },
      {
        title: "The Road",
        slug: "the-road",
        year: 2006,
        type: "book" as const,
        description: "Post-apocalyptic father-son journey",
      },
    ],
  },
  {
    name: "William Faulkner",
    slug: "faulkner",
    years: "1897–1962",
    bio: "American writer and Nobel laureate, known for experimental narrative and Southern Gothic themes.",
    birthYear: 1897,
    deathYear: 1962,
    nationality: "American",
    influencedBy: [] as string[],
    influenced: ["mccarthy", "marquez"],
    works: [
      {
        title: "The Sound and the Fury",
        slug: "sound-fury",
        year: 1929,
        type: "book" as const,
        description: "Stream of consciousness classic",
      },
      {
        title: "Absalom, Absalom!",
        slug: "absalom-absalom",
        year: 1936,
        type: "book" as const,
        description: "Southern tragedy",
      },
    ],
  },
  {
    name: "Ursula K. Le Guin",
    slug: "le-guin",
    years: "1929–2018",
    bio: "American author of speculative fiction, influenced by anthropology and Taoism.",
    birthYear: 1929,
    deathYear: 2018,
    nationality: "American",
    influencedBy: [] as string[],
    influenced: ["chiang"],
    works: [
      {
        title: "The Left Hand of Darkness",
        slug: "left-hand",
        year: 1969,
        type: "book" as const,
        description: "Gender-fluid sci-fi classic",
      },
      {
        title: "The Dispossessed",
        slug: "dispossessed",
        year: 1974,
        type: "book" as const,
        description: "Anarchist utopia/dystopia",
      },
    ],
  },
  {
    name: "Ted Chiang",
    slug: "chiang",
    years: "b. 1967",
    bio: "American speculative fiction writer, known for rigorous exploration of scientific and philosophical concepts.",
    birthYear: 1967,
    nationality: "American",
    influencedBy: ["le-guin"],
    influenced: [] as string[],
    works: [
      {
        title: "Stories of Your Life and Others",
        slug: "stories-of-your-life",
        year: 2002,
        type: "book" as const,
        description: "Mind-bending short stories",
      },
      {
        title: "Exhalation",
        slug: "exhalation",
        year: 2019,
        type: "book" as const,
        description: "More philosophical SF",
      },
    ],
  },
];

type WorkType = "book" | "article" | "screenplay" | "essay" | "poem";

// Clear all creators and works, then re-seed.
// Run: npx convex run seed:resetAndSeed
export const resetAndSeed = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Delete all works first (they reference creators)
    const works = await ctx.db.query("works").collect();
    for (const work of works) {
      await ctx.db.delete(work._id);
    }

    // Delete all creators
    const creators = await ctx.db.query("creators").collect();
    for (const creator of creators) {
      await ctx.db.delete(creator._id);
    }

    // Re-seed by calling the seed logic
    return await seedDatabaseHandler(ctx);
  },
});

export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await seedDatabaseHandler(ctx);
  },
});

// Clear all creators and works.
// Run: npx convex run seed:clearAll
export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const works = await ctx.db.query("works").collect();
    for (const work of works) {
      await ctx.db.delete(work._id);
    }
    const creators = await ctx.db.query("creators").collect();
    for (const creator of creators) {
      await ctx.db.delete(creator._id);
    }
    return { deletedCreators: creators.length, deletedWorks: works.length };
  },
});

// Seed a batch of creators with their works.
// Called by scripts/seed-convex.ts to load all static data.
export const seedBatch = internalMutation({
  args: {
    creators: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        years: v.string(),
        bio: v.string(),
        influencedBy: v.array(v.string()),
        influenced: v.array(v.string()),
        works: v.array(
          v.object({
            slug: v.string(),
            title: v.string(),
            year: v.number(),
            type: v.string(),
            description: v.string(),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const creator of args.creators) {
      // Skip if already exists
      const existing = await ctx.db
        .query("creators")
        .withIndex("by_slug", (q) => q.eq("slug", creator.slug))
        .unique();

      if (existing) {
        results.push({ slug: creator.slug, status: "skipped" });
        continue;
      }

      const creatorId = await ctx.db.insert("creators", {
        name: creator.name,
        slug: creator.slug,
        years: creator.years,
        bio: creator.bio,
        influencedBy: creator.influencedBy,
        influenced: creator.influenced,
        verified: true,
        aiGenerated: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      for (const work of creator.works) {
        await ctx.db.insert("works", {
          title: work.title,
          slug: work.slug,
          year: work.year,
          type: work.type as WorkType,
          description: work.description,
          creatorId,
          influences: [],
          influenced: [],
          themes: [],
          verified: true,
          aiGenerated: false,
          createdAt: Date.now(),
        });
      }

      results.push({
        slug: creator.slug,
        status: "created",
        workCount: creator.works.length,
      });
    }

    return results;
  },
});

// Shared seed logic used by both seedDatabase and resetAndSeed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedDatabaseHandler(ctx: { db: any }) {
  const results = [];

  for (const creatorData of seedCreators) {
    const { works, ...creatorFields } = creatorData;

    // Check if creator already exists
    const existing = await ctx.db
      .query("creators")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withIndex("by_slug", (q: any) => q.eq("slug", creatorFields.slug))
      .unique();

    if (existing) {
      results.push({
        slug: creatorFields.slug,
        status: "skipped",
        id: existing._id,
      });
      continue;
    }

    // Create creator
    const creatorId = await ctx.db.insert("creators", {
      name: creatorFields.name,
      slug: creatorFields.slug,
      years: creatorFields.years,
      bio: creatorFields.bio,
      birthYear: creatorFields.birthYear,
      deathYear: creatorFields.deathYear,
      nationality: creatorFields.nationality,
      influencedBy: creatorFields.influencedBy,
      influenced: creatorFields.influenced,
      verified: true,
      aiGenerated: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create works
    const workIds = [];
    for (const work of works) {
      const workId = await ctx.db.insert("works", {
        ...work,
        type: work.type as WorkType,
        creatorId,
        influences: [],
        influenced: [],
        themes: [],
        verified: true,
        aiGenerated: false,
        createdAt: Date.now(),
      });
      workIds.push(workId);
    }

    results.push({
      slug: creatorFields.slug,
      status: "created",
      creatorId,
      workCount: workIds.length,
    });
  }

  return results;
}
