// Extracted from lib/recommendations.ts for use in Explore filters

// Genre mappings for creators
export const creatorGenres: Record<string, string[]> = {
  // Roots of Modernism
  twain: ["Literary Fiction", "Satire", "Adventure"],
  chekhov: ["Literary Fiction", "Short Stories", "Drama"],
  wells: ["Science Fiction", "Speculative Fiction"],
  stein: ["Literary Fiction", "Modernism", "Experimental"],
  joyce: ["Literary Fiction", "Modernism", "Experimental"],
  woolf: ["Literary Fiction", "Modernism", "Feminist Literature"],
  kafka: ["Literary Fiction", "Modernism", "Surrealism"],
  fitzgerald: ["Literary Fiction", "Modernism"],
  tolkien: ["Fantasy", "Epic Fantasy"],
  // American Masters
  hemingway: ["Literary Fiction", "Modernism", "Minimalism"],
  faulkner: [
    "Literary Fiction",
    "Southern Gothic",
    "Modernism",
    "Experimental",
  ],
  oconnor: ["Literary Fiction", "Southern Gothic", "Short Stories"],
  plath: ["Poetry", "Confessional", "Literary Fiction"],
  morrison: [
    "Literary Fiction",
    "African American Literature",
    "Magical Realism",
  ],
  angelou: ["Memoir", "Poetry", "African American Literature"],
  didion: ["Literary Fiction", "Journalism", "Memoir"],
  kerouac: ["Literary Fiction", "Beat Literature"],
  vonnegut: ["Science Fiction", "Satire", "Literary Fiction"],
  // Minimalism
  carver: ["Literary Fiction", "Minimalism", "Short Stories"],
  wolff: ["Literary Fiction", "Minimalism", "Memoir"],
  hempel: ["Literary Fiction", "Minimalism", "Short Stories"],
  ford: ["Literary Fiction", "Minimalism"],
  // Southern / American Epic
  mccarthy: ["Literary Fiction", "Southern Gothic", "Western"],
  whitehead: [
    "Literary Fiction",
    "African American Literature",
    "Historical Fiction",
  ],
  ward: ["Literary Fiction", "Southern Gothic", "African American Literature"],
  vuong: ["Poetry", "Literary Fiction", "Memoir"],
  // Postmodernism
  pynchon: ["Literary Fiction", "Postmodernism", "Experimental"],
  delillo: ["Literary Fiction", "Postmodernism"],
  wallace: ["Literary Fiction", "Postmodernism", "Experimental"],
  // Speculative Fiction
  huxley: ["Science Fiction", "Dystopia", "Philosophy"],
  orwell: ["Science Fiction", "Dystopia", "Political"],
  bradbury: ["Science Fiction", "Fantasy", "Short Stories"],
  asimov: ["Science Fiction", "Hard SF"],
  dick: ["Science Fiction", "Cyberpunk"],
  "le-guin": ["Science Fiction", "Fantasy", "Speculative Fiction"],
  butler: [
    "Science Fiction",
    "Speculative Fiction",
    "African American Literature",
  ],
  atwood: ["Speculative Fiction", "Dystopia", "Feminist Literature"],
  chiang: ["Science Fiction", "Speculative Fiction", "Philosophy"],
  jemisin: ["Fantasy", "Science Fiction", "Speculative Fiction"],
  clarke: ["Science Fiction", "Hard SF"],
  heinlein: ["Science Fiction", "Hard SF"],
  "l-engle": ["Fantasy", "Science Fiction", "Young Adult"],
  lowry: ["Young Adult", "Dystopia", "Historical Fiction"],
  // Magic Realism / International
  borges: ["Literary Fiction", "Magical Realism", "Philosophy"],
  marquez: ["Literary Fiction", "Magical Realism"],
  murakami: ["Literary Fiction", "Magical Realism", "Surrealism"],
  achebe: ["Literary Fiction", "Postcolonial"],
  adichie: ["Literary Fiction", "Postcolonial", "Feminist Literature"],
  rushdie: ["Literary Fiction", "Magical Realism", "Postcolonial"],
  ishiguro: ["Literary Fiction", "Speculative Fiction"],
  // Screenwriting
  wilder: ["Screenwriting", "Comedy", "Drama"],
  chayefsky: ["Screenwriting", "Satire", "Drama"],
  ephron: ["Screenwriting", "Romantic Comedy"],
  sorkin: ["Screenwriting", "Drama", "Political"],
  "waller-bridge": ["Screenwriting", "Comedy", "Drama"],
  // Pulitzer Winners
  "harper-lee": ["Literary Fiction", "Southern Gothic", "Coming-of-Age"],
  walker: [
    "Literary Fiction",
    "African American Literature",
    "Feminist Literature",
  ],
  roth: ["Literary Fiction", "Satire"],
  robinson: ["Literary Fiction", "Philosophical Fiction"],
  chabon: ["Literary Fiction", "Genre Fiction", "Historical Fiction"],
  egan: ["Literary Fiction", "Postmodernism", "Experimental"],
  // National Book Award
  baldwin: ["Literary Fiction", "African American Literature", "Essay"],
  erdrich: ["Literary Fiction", "Native American Literature"],
  johnson: ["Literary Fiction", "Minimalism", "Short Stories"],
  // Screenplay Oscar Winners
  kaufman: ["Screenwriting", "Surrealism", "Drama"],
  tarantino: ["Screenwriting", "Crime", "Drama"],
  "coen-brothers": ["Screenwriting", "Crime", "Dark Comedy"],
  cody: ["Screenwriting", "Comedy", "Coming-of-Age"],
  peele: ["Screenwriting", "Horror", "Social Commentary"],
  // Teleplay Emmy Winners
  chase: ["Screenwriting", "Drama", "Crime"],
  gilligan: ["Screenwriting", "Drama", "Crime"],
  simon: ["Screenwriting", "Drama", "Social Commentary"],
  coel: ["Screenwriting", "Drama", "Comedy"],
};

// Era mappings
export const creatorEras: Record<string, string> = {
  twain: "1860s-1900s",
  chekhov: "1880s-1900s",
  wells: "1890s-1940s",
  stein: "1900s-1930s",
  joyce: "1910s-1940s",
  woolf: "1910s-1940s",
  kafka: "1910s-1920s",
  fitzgerald: "1920s-1940s",
  tolkien: "1930s-1960s",
  hemingway: "1920s-1950s",
  faulkner: "1920s-1950s",
  huxley: "1930s-1960s",
  orwell: "1930s-1950s",
  borges: "1940s-1970s",
  bradbury: "1940s-1980s",
  asimov: "1940s-1980s",
  wilder: "1940s-1970s",
  chayefsky: "1950s-1970s",
  kerouac: "1950s-1960s",
  "harper-lee": "1960s",
  angelou: "1960s-2000s",
  baldwin: "1950s-1980s",
  heinlein: "1940s-1980s",
  clarke: "1950s-1990s",
  oconnor: "1950s-1960s",
  plath: "1950s-1960s",
  marquez: "1960s-2000s",
  "le-guin": "1960s-1980s",
  vonnegut: "1960s-1990s",
  pynchon: "1960s-2000s",
  didion: "1960s-2000s",
  morrison: "1970s-2000s",
  mccarthy: "1960s-1980s",
  carver: "1960s-1980s",
  wolff: "1970s-2000s",
  hempel: "1980s-2000s",
  ford: "1980s-2000s",
  dick: "1960s-1980s",
  achebe: "1950s-1990s",
  atwood: "1980s-2010s",
  murakami: "1980s-2010s",
  butler: "1970s-2000s",
  ishiguro: "1980s-2010s",
  rushdie: "1980s-2010s",
  ephron: "1980s-2000s",
  roth: "1960s-2000s",
  walker: "1970s-2000s",
  robinson: "1980s-2010s",
  erdrich: "1980s-2010s",
  "l-engle": "1960s-1980s",
  delillo: "1980s-2010s",
  sorkin: "1990s-2010s",
  wallace: "1990s-2000s",
  chiang: "1990s-2010s",
  whitehead: "2000s-2020s",
  ward: "2010s-2020s",
  adichie: "2000s-2020s",
  jemisin: "2010s-2020s",
  vuong: "2010s-2020s",
  "waller-bridge": "2010s-2020s",
  chabon: "1990s-2010s",
  egan: "2000s-2020s",
  johnson: "1990s-2000s",
  lowry: "1980s-2000s",
  kaufman: "1990s-2010s",
  tarantino: "1990s-2010s",
  "coen-brothers": "1990s-2010s",
  cody: "2000s-2010s",
  peele: "2010s-2020s",
  chase: "1990s-2000s",
  gilligan: "2000s-2010s",
  simon: "2000s-2010s",
  coel: "2010s-2020s",
};

// Derive unique genre list for filter chips (sorted, most common first)
export function getGenreFilters(): string[] {
  const counts = new Map<string, number>();
  for (const genres of Object.values(creatorGenres)) {
    for (const g of genres) {
      counts.set(g, (counts.get(g) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);
}

// Era buckets for filter chips
export const eraFilters = [
  { label: "Pre-1900", match: (era: string) => /^1[0-8]\d\ds/.test(era) },
  { label: "1900s-1940s", match: (era: string) => /^19[0-3]\ds/.test(era) },
  { label: "1940s-1960s", match: (era: string) => /^19[4-5]\ds/.test(era) },
  {
    label: "1960s-1980s",
    match: (era: string) => /^196\ds/.test(era) || /^197\ds/.test(era),
  },
  {
    label: "1980s-2000s",
    match: (era: string) => /^198\ds/.test(era) || /^199\ds/.test(era),
  },
  { label: "2000s-2020s", match: (era: string) => /^20[0-2]\ds/.test(era) },
] as const;

export type EraFilter = (typeof eraFilters)[number]["label"];
