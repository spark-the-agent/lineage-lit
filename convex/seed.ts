import { mutation } from "./_generated/server";

// Seed data migration from mock data
// Run this once to populate the database

const seedCreators = [
  {
    name: "Ernest Hemingway",
    slug: "hemingway",
    bio: "American novelist and short story writer, known for his terse prose and the 'iceberg theory'.",
    birthYear: 1899,
    deathYear: 1961,
    nationality: "American",
    influencedBy: [],
    influenced: ["carver", "mccarthy"],
    works: [
      { title: "The Sun Also Rises", slug: "sun-also-rises", year: 1926, type: "book", description: "Lost Generation classic" },
      { title: "The Old Man and the Sea", slug: "old-man-sea", year: 1952, type: "book", description: "Pulitzer Prize winner" },
    ]
  },
  {
    name: "Raymond Carver",
    slug: "carver",
    bio: "American short story writer and poet, master of minimalism and the 'dirty realist' school.",
    birthYear: 1938,
    deathYear: 1988,
    nationality: "American",
    influencedBy: ["hemingway"],
    influenced: ["wolff"],
    works: [
      { title: "What We Talk About When We Talk About Love", slug: "what-we-talk-about", year: 1981, type: "book", description: "Minimalist masterpiece" },
      { title: "Cathedral", slug: "cathedral", year: 1983, type: "book", description: "Later, more expansive work" },
    ]
  },
  {
    name: "Cormac McCarthy",
    slug: "mccarthy",
    bio: "American novelist known for his sparse prose and violent, biblical themes.",
    birthYear: 1933,
    deathYear: 2023,
    nationality: "American",
    influencedBy: ["hemingway", "faulkner"],
    influenced: [],
    works: [
      { title: "Blood Meridian", slug: "blood-meridian", year: 1985, type: "book", description: "Violent Western epic" },
      { title: "The Road", slug: "the-road", year: 2006, type: "book", description: "Post-apocalyptic father-son journey" },
    ]
  },
  {
    name: "William Faulkner",
    slug: "faulkner",
    bio: "American writer and Nobel laureate, known for experimental narrative and Southern Gothic themes.",
    birthYear: 1897,
    deathYear: 1962,
    nationality: "American",
    influencedBy: [],
    influenced: ["mccarthy", "marquez"],
    works: [
      { title: "The Sound and the Fury", slug: "sound-fury", year: 1929, type: "book", description: "Stream of consciousness classic" },
      { title: "Absalom, Absalom!", slug: "absalom-absalom", year: 1936, type: "book", description: "Southern tragedy" },
    ]
  },
  {
    name: "Ursula K. Le Guin",
    slug: "le-guin",
    bio: "American author of speculative fiction, influenced by anthropology and Taoism.",
    birthYear: 1929,
    deathYear: 2018,
    nationality: "American",
    influencedBy: [],
    influenced: ["chiang"],
    works: [
      { title: "The Left Hand of Darkness", slug: "left-hand", year: 1969, type: "book", description: "Gender-fluid sci-fi classic" },
      { title: "The Dispossessed", slug: "dispossessed", year: 1974, type: "book", description: "Anarchist utopia/dystopia" },
    ]
  },
  {
    name: "Ted Chiang",
    slug: "chiang",
    bio: "American speculative fiction writer, known for rigorous exploration of scientific and philosophical concepts.",
    birthYear: 1967,
    nationality: "American",
    influencedBy: ["le-guin"],
    influenced: [],
    works: [
      { title: "Stories of Your Life and Others", slug: "stories-of-your-life", year: 2002, type: "book", description: "Mind-bending short stories" },
      { title: "Exhalation", slug: "exhalation", year: 2019, type: "book", description: "More philosophical SF" },
    ]
  },
];

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const results = [];
    
    for (const creatorData of seedCreators) {
      const { works, ...creatorFields } = creatorData;
      
      // Check if creator already exists
      const existing = await ctx.db
        .query("creators")
        .withIndex("by_slug", (q) => q.eq("slug", creatorFields.slug))
        .unique();
      
      if (existing) {
        results.push({ slug: creatorFields.slug, status: "skipped", id: existing._id });
        continue;
      }
      
      // Create creator
      const creatorId = await ctx.db.insert("creators", {
        ...creatorFields,
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
        workCount: workIds.length 
      });
    }
    
    return results;
  },
});
