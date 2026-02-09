export interface Creator {
  id: string;
  name: string;
  years: string;
  bio: string;
  influencedBy: string[];
  influenced: string[];
  works: Work[];
}

export interface Work {
  id: string;
  title: string;
  year: number;
  type: 'book' | 'screenplay' | 'article';
  description: string;
}

export const creators: Creator[] = [
  {
    id: "hemingway",
    name: "Ernest Hemingway",
    years: "1899-1961",
    bio: "American novelist and short story writer, known for his terse prose and the 'iceberg theory'.",
    influencedBy: [],
    influenced: ["carver", "mccarthy"],
    works: [
      { id: "sun-also-rises", title: "The Sun Also Rises", year: 1926, type: "book", description: "Lost Generation classic" },
      { id: "old-man-sea", title: "The Old Man and the Sea", year: 1952, type: "book", description: "Pulitzer Prize winner" }
    ]
  },
  {
    id: "carver",
    name: "Raymond Carver",
    years: "1938-1988",
    bio: "American short story writer and poet, master of minimalism and the 'dirty realist' school.",
    influencedBy: ["hemingway"],
    influenced: ["wolff"],
    works: [
      { id: "what-we-talk-about", title: "What We Talk About When We Talk About Love", year: 1981, type: "book", description: "Minimalist masterpiece" },
      { id: "cathedral", title: "Cathedral", year: 1983, type: "book", description: "Later, more expansive work" }
    ]
  },
  {
    id: "mccarthy",
    name: "Cormac McCarthy",
    years: "1933-2023",
    bio: "American novelist known for his sparse prose and violent, biblical themes.",
    influencedBy: ["hemingway", "faulkner"],
    influenced: [],
    works: [
      { id: "blood-meridian", title: "Blood Meridian", year: 1985, type: "book", description: "Violent Western epic" },
      { id: "the-road", title: "The Road", year: 2006, type: "book", description: "Post-apocalyptic father-son journey" }
    ]
  },
  {
    id: "faulkner",
    name: "William Faulkner",
    years: "1897-1962",
    bio: "American writer and Nobel laureate, known for experimental narrative and Southern Gothic themes.",
    influencedBy: [],
    influenced: ["mccarthy", "marquez"],
    works: [
      { id: "sound-fury", title: "The Sound and the Fury", year: 1929, type: "book", description: "Stream of consciousness classic" },
      { id: "absalom-absalom", title: "Absalom, Absalom!", year: 1936, type: "book", description: "Southern tragedy" }
    ]
  },
  {
    id: "le-guin",
    name: "Ursula K. Le Guin",
    years: "1929-2018",
    bio: "American author of speculative fiction, influenced by anthropology and Taoism.",
    influencedBy: [],
    influenced: ["chiang"],
    works: [
      { id: "left-hand", title: "The Left Hand of Darkness", year: 1969, type: "book", description: "Gender-fluid sci-fi classic" },
      { id: "dispossessed", title: "The Dispossessed", year: 1974, type: "book", description: "Anarchist utopia/dystopia" }
    ]
  },
  {
    id: "chiang",
    name: "Ted Chiang",
    years: "b. 1967",
    bio: "American speculative fiction writer, known for rigorous exploration of scientific and philosophical concepts.",
    influencedBy: ["le-guin"],
    influenced: [],
    works: [
      { id: "stories-of-your-life", title: "Stories of Your Life and Others", year: 2002, type: "book", description: "Mind-bending short stories" },
      { id: "exhalation", title: "Exhalation", year: 2019, type: "book", description: "More philosophical SF" }
    ]
  },
  {
    id: "sorkin",
    name: "Aaron Sorkin",
    years: "b. 1961",
    bio: "American screenwriter known for rapid-fire dialogue and idealistic characters.",
    influencedBy: ["chayefsky"],
    influenced: [],
    works: [
      { id: "west-wing", title: "The West Wing", year: 1999, type: "screenplay", description: "Political drama series" },
      { id: "social-network", title: "The Social Network", year: 2010, type: "screenplay", description: "Facebook origin story" }
    ]
  },
  {
    id: "chayefsky",
    name: "Paddy Chayefsky",
    years: "1923-1981",
    bio: "American playwright and screenwriter, master of television drama and satirical film.",
    influencedBy: [],
    influenced: ["sorkin"],
    works: [
      { id: "network", title: "Network", year: 1976, type: "screenplay", description: "Media satire, 'mad as hell'" },
      { id: "marty", title: "Marty", year: 1955, type: "screenplay", description: "TV drama turned Oscar winner" }
    ]
  }
];

export function getCreatorById(id: string): Creator | undefined {
  return creators.find(c => c.id === id);
}

export function getAllCreators(): Creator[] {
  return creators;
}

export function getLineage(creatorId: string): { ancestors: Creator[], descendants: Creator[] } {
  const creator = getCreatorById(creatorId);
  if (!creator) return { ancestors: [], descendants: [] };
  
  const ancestors = creator.influencedBy
    .map(id => getCreatorById(id))
    .filter((c): c is Creator => c !== undefined);
    
  const descendants = creator.influenced
    .map(id => getCreatorById(id))
    .filter((c): c is Creator => c !== undefined);
    
  return { ancestors, descendants };
}
