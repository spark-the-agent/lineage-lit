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
  // ==================== ROOTS OF MODERNISM ====================
  {
    id: "twain",
    name: "Mark Twain",
    years: "1835-1910",
    bio: "Father of American literature whose vernacular storytelling and satirical voice shaped every generation after him.",
    influencedBy: [],
    influenced: ["hemingway", "faulkner", "vonnegut"],
    works: [
      { id: "huck-finn", title: "Adventures of Huckleberry Finn", year: 1884, type: "book", description: "The great American novel" },
      { id: "tom-sawyer", title: "The Adventures of Tom Sawyer", year: 1876, type: "book", description: "Boyhood along the Mississippi" }
    ]
  },
  {
    id: "chekhov",
    name: "Anton Chekhov",
    years: "1860-1904",
    bio: "Russian playwright and short story master whose understated style revolutionized modern drama and fiction.",
    influencedBy: [],
    influenced: ["hemingway", "carver", "ishiguro"],
    works: [
      { id: "cherry-orchard", title: "The Cherry Orchard", year: 1904, type: "book", description: "Tragicomedy of Russian gentry" },
      { id: "lady-with-dog", title: "The Lady with the Dog", year: 1899, type: "book", description: "Masterpiece of the short story form" }
    ]
  },
  {
    id: "wells",
    name: "H.G. Wells",
    years: "1866-1946",
    bio: "Father of science fiction who imagined time travel, alien invasion, and invisible men before anyone else.",
    influencedBy: [],
    influenced: ["huxley", "bradbury", "asimov"],
    works: [
      { id: "time-machine", title: "The Time Machine", year: 1895, type: "book", description: "First great time travel story" },
      { id: "war-of-worlds", title: "The War of the Worlds", year: 1898, type: "book", description: "Alien invasion of Earth" }
    ]
  },
  {
    id: "stein",
    name: "Gertrude Stein",
    years: "1874-1946",
    bio: "Avant-garde writer and Paris salon host who mentored the Lost Generation and pioneered literary modernism.",
    influencedBy: [],
    influenced: ["hemingway", "fitzgerald"],
    works: [
      { id: "three-lives", title: "Three Lives", year: 1909, type: "book", description: "Experimental portraits of women" },
      { id: "tender-buttons", title: "Tender Buttons", year: 1914, type: "book", description: "Radical prose poetry" }
    ]
  },
  {
    id: "joyce",
    name: "James Joyce",
    years: "1882-1941",
    bio: "Irish modernist whose stream of consciousness technique and linguistic invention redefined the novel.",
    influencedBy: [],
    influenced: ["faulkner", "woolf", "delillo"],
    works: [
      { id: "ulysses", title: "Ulysses", year: 1922, type: "book", description: "One day in Dublin, all of literature" },
      { id: "dubliners", title: "Dubliners", year: 1914, type: "book", description: "Epiphanies of Irish life" }
    ]
  },
  {
    id: "woolf",
    name: "Virginia Woolf",
    years: "1882-1941",
    bio: "Modernist novelist and essayist who pioneered stream of consciousness and feminist literary criticism.",
    influencedBy: ["joyce"],
    influenced: ["morrison", "plath"],
    works: [
      { id: "mrs-dalloway", title: "Mrs Dalloway", year: 1925, type: "book", description: "One day in post-war London" },
      { id: "to-lighthouse", title: "To the Lighthouse", year: 1927, type: "book", description: "Memory, loss, and art" }
    ]
  },
  {
    id: "kafka",
    name: "Franz Kafka",
    years: "1883-1924",
    bio: "Czech-born writer whose nightmarish visions of bureaucracy and alienation gave the world 'Kafkaesque.'",
    influencedBy: [],
    influenced: ["borges", "murakami"],
    works: [
      { id: "the-trial", title: "The Trial", year: 1925, type: "book", description: "Arrested for an unnamed crime" },
      { id: "metamorphosis", title: "The Metamorphosis", year: 1915, type: "book", description: "Waking up as an insect" }
    ]
  },
  {
    id: "fitzgerald",
    name: "F. Scott Fitzgerald",
    years: "1896-1940",
    bio: "Chronicler of the Jazz Age whose lyrical prose captured American dreams and disillusion.",
    influencedBy: ["stein"],
    influenced: [],
    works: [
      { id: "great-gatsby", title: "The Great Gatsby", year: 1925, type: "book", description: "The American Dream, shattered" },
      { id: "tender-is-night", title: "Tender Is the Night", year: 1934, type: "book", description: "Expatriate decline on the Riviera" }
    ]
  },
  {
    id: "tolkien",
    name: "J.R.R. Tolkien",
    years: "1892-1973",
    bio: "Philologist who invented modern fantasy, building Middle-earth from languages up.",
    influencedBy: [],
    influenced: ["le-guin"],
    works: [
      { id: "lord-of-rings", title: "The Lord of the Rings", year: 1954, type: "book", description: "The quest to destroy the One Ring" },
      { id: "the-hobbit", title: "The Hobbit", year: 1937, type: "book", description: "There and back again" }
    ]
  },

  // ==================== AMERICAN MASTERS ====================
  {
    id: "hemingway",
    name: "Ernest Hemingway",
    years: "1899-1961",
    bio: "American novelist and short story writer, known for his terse prose and the 'iceberg theory'.",
    influencedBy: ["chekhov", "stein", "twain"],
    influenced: ["carver", "mccarthy", "didion"],
    works: [
      { id: "sun-also-rises", title: "The Sun Also Rises", year: 1926, type: "book", description: "Lost Generation classic" },
      { id: "old-man-sea", title: "The Old Man and the Sea", year: 1952, type: "book", description: "Pulitzer Prize winner" }
    ]
  },
  {
    id: "faulkner",
    name: "William Faulkner",
    years: "1897-1962",
    bio: "American writer and Nobel laureate, known for experimental narrative and Southern Gothic themes.",
    influencedBy: ["joyce", "twain"],
    influenced: ["mccarthy", "marquez", "morrison", "oconnor", "ward"],
    works: [
      { id: "sound-fury", title: "The Sound and the Fury", year: 1929, type: "book", description: "Stream of consciousness classic" },
      { id: "absalom-absalom", title: "Absalom, Absalom!", year: 1936, type: "book", description: "Southern tragedy" }
    ]
  },
  {
    id: "oconnor",
    name: "Flannery O'Connor",
    years: "1925-1964",
    bio: "Southern Gothic master whose darkly comic fiction explored grace, violence, and the grotesque.",
    influencedBy: ["faulkner"],
    influenced: [],
    works: [
      { id: "wise-blood", title: "Wise Blood", year: 1952, type: "book", description: "A man founds a church without Christ" },
      { id: "good-man-hard-find", title: "A Good Man Is Hard to Find", year: 1955, type: "book", description: "Unforgettable Southern Gothic stories" }
    ]
  },
  {
    id: "plath",
    name: "Sylvia Plath",
    years: "1932-1963",
    bio: "Confessional poet and novelist whose searing intensity made her an icon of literary self-revelation.",
    influencedBy: ["woolf"],
    influenced: [],
    works: [
      { id: "the-bell-jar", title: "The Bell Jar", year: 1963, type: "book", description: "Autobiographical descent into breakdown" },
      { id: "ariel", title: "Ariel", year: 1965, type: "book", description: "Posthumous poems of fierce brilliance" }
    ]
  },
  {
    id: "morrison",
    name: "Toni Morrison",
    years: "1931-2019",
    bio: "Nobel laureate who excavated the African American experience with lyrical, mythic power.",
    influencedBy: ["faulkner", "woolf"],
    influenced: ["whitehead", "ward", "adichie"],
    works: [
      { id: "beloved", title: "Beloved", year: 1987, type: "book", description: "A ghost story about slavery's aftermath" },
      { id: "song-of-solomon", title: "Song of Solomon", year: 1977, type: "book", description: "Flight, identity, and myth" }
    ]
  },
  {
    id: "angelou",
    name: "Maya Angelou",
    years: "1928-2014",
    bio: "Memoirist, poet, and civil rights voice whose autobiographies transformed American letters.",
    influencedBy: [],
    influenced: [],
    works: [
      { id: "caged-bird", title: "I Know Why the Caged Bird Sings", year: 1969, type: "book", description: "Coming of age in the segregated South" },
      { id: "still-i-rise", title: "And Still I Rise", year: 1978, type: "book", description: "Defiant, joyful poetry" }
    ]
  },
  {
    id: "didion",
    name: "Joan Didion",
    years: "1934-2021",
    bio: "Essayist and novelist whose cool, precise prose dissected California, politics, and grief.",
    influencedBy: ["hemingway"],
    influenced: [],
    works: [
      { id: "slouching-bethlehem", title: "Slouching Towards Bethlehem", year: 1968, type: "article", description: "Essays on the 1960s counterculture" },
      { id: "year-magical-thinking", title: "The Year of Magical Thinking", year: 2005, type: "book", description: "Memoir of sudden loss" }
    ]
  },
  {
    id: "kerouac",
    name: "Jack Kerouac",
    years: "1922-1969",
    bio: "Beat Generation icon whose spontaneous prose captured the restless spirit of postwar America.",
    influencedBy: [],
    influenced: [],
    works: [
      { id: "on-the-road", title: "On the Road", year: 1957, type: "book", description: "Jazz-fueled cross-country odyssey" },
      { id: "dharma-bums", title: "The Dharma Bums", year: 1958, type: "book", description: "Beat Buddhism in the mountains" }
    ]
  },
  {
    id: "vonnegut",
    name: "Kurt Vonnegut",
    years: "1922-2007",
    bio: "Satirist who blended science fiction with dark humor to expose the absurdity of war and modern life.",
    influencedBy: ["twain"],
    influenced: [],
    works: [
      { id: "slaughterhouse-five", title: "Slaughterhouse-Five", year: 1969, type: "book", description: "Unstuck in time after Dresden" },
      { id: "cats-cradle", title: "Cat's Cradle", year: 1963, type: "book", description: "Ice-nine and the end of the world" }
    ]
  },

  // ==================== MINIMALISM ====================
  {
    id: "carver",
    name: "Raymond Carver",
    years: "1938-1988",
    bio: "American short story writer and poet, master of minimalism and the 'dirty realist' school.",
    influencedBy: ["hemingway", "chekhov"],
    influenced: ["wolff", "hempel", "murakami", "ford"],
    works: [
      { id: "what-we-talk-about", title: "What We Talk About When We Talk About Love", year: 1981, type: "book", description: "Minimalist masterpiece" },
      { id: "cathedral", title: "Cathedral", year: 1983, type: "book", description: "Later, more expansive work" }
    ]
  },
  {
    id: "wolff",
    name: "Tobias Wolff",
    years: "b. 1945",
    bio: "Memoirist and short story writer who brought warmth and moral complexity to literary minimalism.",
    influencedBy: ["carver"],
    influenced: [],
    works: [
      { id: "this-boys-life", title: "This Boy's Life", year: 1989, type: "book", description: "Memoir of a difficult boyhood" },
      { id: "in-garden-north", title: "In the Garden of the North American Martyrs", year: 1981, type: "book", description: "Precise, devastating stories" }
    ]
  },
  {
    id: "hempel",
    name: "Amy Hempel",
    years: "b. 1951",
    bio: "Minimalist story writer whose compressed, elliptical prose makes every sentence carry enormous weight.",
    influencedBy: ["carver"],
    influenced: [],
    works: [
      { id: "reasons-to-live", title: "Reasons to Live", year: 1985, type: "book", description: "Tiny, perfect stories" },
      { id: "collected-stories", title: "The Collected Stories", year: 2006, type: "book", description: "A lifetime of brevity" }
    ]
  },
  {
    id: "ford",
    name: "Richard Ford",
    years: "b. 1944",
    bio: "Novelist of American restlessness whose Frank Bascombe trilogy maps suburban consciousness.",
    influencedBy: ["carver"],
    influenced: [],
    works: [
      { id: "the-sportswriter", title: "The Sportswriter", year: 1986, type: "book", description: "Quiet crisis in the suburbs" },
      { id: "independence-day", title: "Independence Day", year: 1995, type: "book", description: "Pulitzer-winning sequel" }
    ]
  },

  // ==================== SOUTHERN / AMERICAN EPIC ====================
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
    id: "whitehead",
    name: "Colson Whitehead",
    years: "b. 1969",
    bio: "Two-time Pulitzer winner who reimagines American history through inventive, genre-bending fiction.",
    influencedBy: ["morrison"],
    influenced: [],
    works: [
      { id: "underground-railroad", title: "The Underground Railroad", year: 2016, type: "book", description: "Literal railroad beneath the South" },
      { id: "nickel-boys", title: "The Nickel Boys", year: 2019, type: "book", description: "Reform school horrors in Jim Crow Florida" }
    ]
  },
  {
    id: "ward",
    name: "Jesmyn Ward",
    years: "b. 1977",
    bio: "Two-time National Book Award winner channeling the rural South with Faulknerian lyricism.",
    influencedBy: ["morrison", "faulkner"],
    influenced: [],
    works: [
      { id: "sing-unburied", title: "Sing, Unburied, Sing", year: 2017, type: "book", description: "Ghosts and family in Mississippi" },
      { id: "salvage-bones", title: "Salvage the Bones", year: 2011, type: "book", description: "Hurricane Katrina from inside" }
    ]
  },
  {
    id: "vuong",
    name: "Ocean Vuong",
    years: "b. 1988",
    bio: "Vietnamese-American poet and novelist whose lyrical prose explores war, immigration, and identity.",
    influencedBy: [],
    influenced: [],
    works: [
      { id: "on-earth-briefly", title: "On Earth We're Briefly Gorgeous", year: 2019, type: "book", description: "Letter from a son to his mother" },
      { id: "night-sky-exit-wounds", title: "Night Sky with Exit Wounds", year: 2016, type: "book", description: "War and desire in verse" }
    ]
  },

  // ==================== POSTMODERNISM ====================
  {
    id: "pynchon",
    name: "Thomas Pynchon",
    years: "b. 1937",
    bio: "Reclusive postmodernist whose encyclopedic novels weave conspiracy, entropy, and paranoia.",
    influencedBy: [],
    influenced: ["wallace", "delillo"],
    works: [
      { id: "gravitys-rainbow", title: "Gravity's Rainbow", year: 1973, type: "book", description: "WWII rockets and paranoia" },
      { id: "crying-of-lot-49", title: "The Crying of Lot 49", year: 1966, type: "book", description: "Conspiracies in California" }
    ]
  },
  {
    id: "delillo",
    name: "Don DeLillo",
    years: "b. 1936",
    bio: "Novelist of American paranoia whose prose captures the white noise of consumer culture and technology.",
    influencedBy: ["pynchon", "joyce"],
    influenced: [],
    works: [
      { id: "white-noise", title: "White Noise", year: 1985, type: "book", description: "Fear of death in a toxic cloud" },
      { id: "underworld", title: "Underworld", year: 1997, type: "book", description: "Cold War America in a baseball" }
    ]
  },
  {
    id: "wallace",
    name: "David Foster Wallace",
    years: "1962-2008",
    bio: "Maximalist writer who turned self-consciousness into art, battling irony with sincerity.",
    influencedBy: ["pynchon", "delillo"],
    influenced: [],
    works: [
      { id: "infinite-jest", title: "Infinite Jest", year: 1996, type: "book", description: "Entertainment, addiction, and tennis" },
      { id: "supposedly-fun-thing", title: "A Supposedly Fun Thing I'll Never Do Again", year: 1997, type: "article", description: "Essays of hyper-aware observation" }
    ]
  },

  // ==================== SPECULATIVE FICTION ====================
  {
    id: "huxley",
    name: "Aldous Huxley",
    years: "1894-1963",
    bio: "British novelist whose dystopia of pleasure and control remains terrifyingly prescient.",
    influencedBy: ["wells"],
    influenced: ["orwell"],
    works: [
      { id: "brave-new-world", title: "Brave New World", year: 1932, type: "book", description: "Dystopia through pleasure, not pain" },
      { id: "doors-of-perception", title: "The Doors of Perception", year: 1954, type: "book", description: "Mescaline and consciousness" }
    ]
  },
  {
    id: "orwell",
    name: "George Orwell",
    years: "1903-1950",
    bio: "British essayist and novelist whose political clarity gave the world Big Brother and Newspeak.",
    influencedBy: ["huxley"],
    influenced: ["atwood"],
    works: [
      { id: "nineteen-eighty-four", title: "Nineteen Eighty-Four", year: 1949, type: "book", description: "Totalitarianism and thought control" },
      { id: "animal-farm", title: "Animal Farm", year: 1945, type: "book", description: "Revolution betrayed, in a barnyard" }
    ]
  },
  {
    id: "bradbury",
    name: "Ray Bradbury",
    years: "1920-2012",
    bio: "Poet of science fiction whose lyrical imagination turned rockets and book-burning into literature.",
    influencedBy: ["wells"],
    influenced: [],
    works: [
      { id: "fahrenheit-451", title: "Fahrenheit 451", year: 1953, type: "book", description: "Firemen who burn books" },
      { id: "martian-chronicles", title: "The Martian Chronicles", year: 1950, type: "book", description: "Colonizing Mars, losing Earth" }
    ]
  },
  {
    id: "asimov",
    name: "Isaac Asimov",
    years: "1920-1992",
    bio: "Biochemist-turned-author who built the Foundation of science fiction with logic, robots, and galaxies.",
    influencedBy: ["wells"],
    influenced: ["dick"],
    works: [
      { id: "foundation", title: "Foundation", year: 1951, type: "book", description: "Psychohistory and galactic empire" },
      { id: "i-robot", title: "I, Robot", year: 1950, type: "book", description: "Three laws of robotics" }
    ]
  },
  {
    id: "dick",
    name: "Philip K. Dick",
    years: "1928-1982",
    bio: "Visionary whose paranoid, reality-bending stories became the blueprint for cyberpunk and modern sci-fi film.",
    influencedBy: ["asimov"],
    influenced: [],
    works: [
      { id: "do-androids-dream", title: "Do Androids Dream of Electric Sheep?", year: 1968, type: "book", description: "What makes us human (became Blade Runner)" },
      { id: "man-high-castle", title: "The Man in the High Castle", year: 1962, type: "book", description: "Axis powers won WWII" }
    ]
  },
  {
    id: "le-guin",
    name: "Ursula K. Le Guin",
    years: "1929-2018",
    bio: "American author of speculative fiction, influenced by anthropology and Taoism.",
    influencedBy: ["borges", "tolkien"],
    influenced: ["chiang", "butler", "jemisin"],
    works: [
      { id: "left-hand", title: "The Left Hand of Darkness", year: 1969, type: "book", description: "Gender-fluid sci-fi classic" },
      { id: "dispossessed", title: "The Dispossessed", year: 1974, type: "book", description: "Anarchist utopia/dystopia" }
    ]
  },
  {
    id: "butler",
    name: "Octavia Butler",
    years: "1947-2006",
    bio: "Pioneering Black woman in sci-fi who explored power, identity, and survival through speculative fiction.",
    influencedBy: ["le-guin"],
    influenced: ["jemisin"],
    works: [
      { id: "kindred", title: "Kindred", year: 1979, type: "book", description: "Time travel to antebellum slavery" },
      { id: "parable-sower", title: "Parable of the Sower", year: 1993, type: "book", description: "Survival in a collapsing America" }
    ]
  },
  {
    id: "atwood",
    name: "Margaret Atwood",
    years: "b. 1939",
    bio: "Canadian author whose speculative fiction dissects patriarchy, power, and ecological collapse.",
    influencedBy: ["orwell"],
    influenced: [],
    works: [
      { id: "handmaids-tale", title: "The Handmaid's Tale", year: 1985, type: "book", description: "Theocratic dystopia and female subjugation" },
      { id: "oryx-and-crake", title: "Oryx and Crake", year: 2003, type: "book", description: "Biotech apocalypse" }
    ]
  },
  {
    id: "chiang",
    name: "Ted Chiang",
    years: "b. 1967",
    bio: "American speculative fiction writer, known for rigorous exploration of scientific and philosophical concepts.",
    influencedBy: ["le-guin", "borges"],
    influenced: [],
    works: [
      { id: "stories-of-your-life", title: "Stories of Your Life and Others", year: 2002, type: "book", description: "Mind-bending short stories" },
      { id: "exhalation", title: "Exhalation", year: 2019, type: "book", description: "More philosophical SF" }
    ]
  },
  {
    id: "jemisin",
    name: "N.K. Jemisin",
    years: "b. 1972",
    bio: "First author to win three consecutive Hugo Awards, redefining epic fantasy with radical world-building.",
    influencedBy: ["le-guin", "butler"],
    influenced: [],
    works: [
      { id: "fifth-season", title: "The Fifth Season", year: 2015, type: "book", description: "Second-person apocalyptic fantasy" },
      { id: "hundred-thousand-kingdoms", title: "The Hundred Thousand Kingdoms", year: 2010, type: "book", description: "Gods in chains" }
    ]
  },

  // ==================== MAGIC REALISM / INTERNATIONAL ====================
  {
    id: "borges",
    name: "Jorge Luis Borges",
    years: "1899-1986",
    bio: "Argentine fabulist whose labyrinths, mirrors, and infinite libraries made fiction a branch of philosophy.",
    influencedBy: ["kafka"],
    influenced: ["le-guin", "marquez", "chiang", "rushdie"],
    works: [
      { id: "ficciones", title: "Ficciones", year: 1944, type: "book", description: "Stories as metaphysical puzzles" },
      { id: "aleph", title: "The Aleph", year: 1949, type: "book", description: "A point containing all points" }
    ]
  },
  {
    id: "marquez",
    name: "Gabriel Garcia Marquez",
    years: "1927-2014",
    bio: "Colombian Nobel laureate who made magic realism a global literary language.",
    influencedBy: ["faulkner", "borges"],
    influenced: ["rushdie"],
    works: [
      { id: "hundred-years", title: "One Hundred Years of Solitude", year: 1967, type: "book", description: "Seven generations of the Buendia family" },
      { id: "love-time-cholera", title: "Love in the Time of Cholera", year: 1985, type: "book", description: "Love that waits fifty years" }
    ]
  },
  {
    id: "murakami",
    name: "Haruki Murakami",
    years: "b. 1949",
    bio: "Japanese novelist who blends Western minimalism with surreal, dreamlike narratives of loneliness.",
    influencedBy: ["carver", "kafka"],
    influenced: [],
    works: [
      { id: "norwegian-wood", title: "Norwegian Wood", year: 1987, type: "book", description: "Memory and loss in 1960s Tokyo" },
      { id: "wind-up-bird", title: "The Wind-Up Bird Chronicle", year: 1994, type: "book", description: "Surreal quest beneath Tokyo" }
    ]
  },
  {
    id: "achebe",
    name: "Chinua Achebe",
    years: "1930-2013",
    bio: "Nigerian novelist who answered colonialism with the African novel's founding masterpiece.",
    influencedBy: [],
    influenced: ["adichie"],
    works: [
      { id: "things-fall-apart", title: "Things Fall Apart", year: 1958, type: "book", description: "Igbo life before and after colonialism" },
      { id: "no-longer-at-ease", title: "No Longer at Ease", year: 1960, type: "book", description: "Corruption and idealism in Nigeria" }
    ]
  },
  {
    id: "adichie",
    name: "Chimamanda Ngozi Adichie",
    years: "b. 1977",
    bio: "Nigerian author whose fiction and essays on race, gender, and identity reshaped global conversations.",
    influencedBy: ["achebe", "morrison"],
    influenced: [],
    works: [
      { id: "americanah", title: "Americanah", year: 2013, type: "book", description: "Immigration, race, and return" },
      { id: "half-yellow-sun", title: "Half of a Yellow Sun", year: 2006, type: "book", description: "Love and war in Biafra" }
    ]
  },
  {
    id: "rushdie",
    name: "Salman Rushdie",
    years: "b. 1947",
    bio: "British-Indian novelist whose magical realism and linguistic fireworks remixed the postcolonial novel.",
    influencedBy: ["borges", "marquez"],
    influenced: [],
    works: [
      { id: "midnights-children", title: "Midnight's Children", year: 1981, type: "book", description: "India's independence through magic" },
      { id: "satanic-verses", title: "The Satanic Verses", year: 1988, type: "book", description: "Migration, faith, and transformation" }
    ]
  },
  {
    id: "ishiguro",
    name: "Kazuo Ishiguro",
    years: "b. 1954",
    bio: "British-Japanese Nobel laureate whose restrained, melancholic fiction explores memory, duty, and self-deception.",
    influencedBy: ["chekhov"],
    influenced: [],
    works: [
      { id: "remains-of-day", title: "The Remains of the Day", year: 1989, type: "book", description: "A butler's unreliable memories" },
      { id: "never-let-me-go", title: "Never Let Me Go", year: 2005, type: "book", description: "Quiet dystopia about clones" }
    ]
  },

  // ==================== SCREENWRITING ====================
  {
    id: "wilder",
    name: "Billy Wilder",
    years: "1906-2002",
    bio: "Austrian-born director and screenwriter whose wit and cynicism defined Hollywood's golden age.",
    influencedBy: [],
    influenced: ["ephron"],
    works: [
      { id: "some-like-it-hot", title: "Some Like It Hot", year: 1959, type: "screenplay", description: "The greatest comedy ever made" },
      { id: "sunset-boulevard", title: "Sunset Boulevard", year: 1950, type: "screenplay", description: "Hollywood eats its own" }
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
  },
  {
    id: "ephron",
    name: "Nora Ephron",
    years: "1941-2012",
    bio: "Screenwriter, director, and essayist who reinvented the romantic comedy with sharp, literate dialogue.",
    influencedBy: ["wilder"],
    influenced: ["waller-bridge"],
    works: [
      { id: "when-harry-met-sally", title: "When Harry Met Sally...", year: 1989, type: "screenplay", description: "Can men and women be friends?" },
      { id: "sleepless-in-seattle", title: "Sleepless in Seattle", year: 1993, type: "screenplay", description: "Fate and long-distance love" }
    ]
  },
  {
    id: "sorkin",
    name: "Aaron Sorkin",
    years: "b. 1961",
    bio: "American screenwriter known for rapid-fire dialogue and idealistic characters.",
    influencedBy: ["chayefsky"],
    influenced: ["waller-bridge"],
    works: [
      { id: "west-wing", title: "The West Wing", year: 1999, type: "screenplay", description: "Political drama series" },
      { id: "social-network", title: "The Social Network", year: 2010, type: "screenplay", description: "Facebook origin story" }
    ]
  },
  {
    id: "waller-bridge",
    name: "Phoebe Waller-Bridge",
    years: "b. 1985",
    bio: "British writer-actor who broke the fourth wall and the rom-com mold with unflinching honesty.",
    influencedBy: ["ephron", "sorkin"],
    influenced: [],
    works: [
      { id: "fleabag", title: "Fleabag", year: 2016, type: "screenplay", description: "Grief, sex, and a hot priest" },
      { id: "killing-eve", title: "Killing Eve", year: 2018, type: "screenplay", description: "Cat-and-mouse obsession" }
    ]
  },
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
