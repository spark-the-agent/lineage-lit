import { Creator, creators, getCreatorById } from "./data";

// User Types
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  joinedAt: Date;
  readingDNA: ReadingDNA;
  followers: string[];
  following: string[];
  savedCreators: string[];
  readWorks: string[];
  likedWorks: string[];
  favoriteGenres: string[];
  eraPreferences: string[];
}

export interface ReadingDNA {
  totalBooks: number;
  totalAuthors: number;
  favoriteGenres: { name: string; percentage: number }[];
  eraBreakdown: { era: string; count: number }[];
  influenceScore: number;
  literaryDNA: string[];
  topAuthors: string[];
  recentlyViewed: string[];
}

export interface Activity {
  id: string;
  userId: string;
  type:
    | "followed_user"
    | "followed_creator"
    | "liked_work"
    | "read_work"
    | "saved_creator"
    | "shared_lineage";
  targetId: string;
  targetType: "user" | "creator" | "work";
  targetName: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Mock Current User (in real app, this would come from auth)
export const currentUser: UserProfile = {
  id: "user-1",
  username: "bookworm42",
  displayName: "Alex Reader",
  bio: "Literary fiction enthusiast. Currently exploring the modernist lineage.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  joinedAt: new Date("2024-01-15"),
  readingDNA: {
    totalBooks: 47,
    totalAuthors: 32,
    favoriteGenres: [
      { name: "Literary Fiction", percentage: 40 },
      { name: "Science Fiction", percentage: 30 },
      { name: "Screenwriting", percentage: 15 },
      { name: "Philosophy", percentage: 15 },
    ],
    eraBreakdown: [
      { era: "1920s-1950s", count: 12 },
      { era: "1960s-1980s", count: 18 },
      { era: "1990s-2010s", count: 17 },
    ],
    influenceScore: 78,
    literaryDNA: ["Modernist", "Speculative", "Minimalist", "Humanist"],
    topAuthors: ["hemingway", "carver", "le-guin", "chiang"],
    recentlyViewed: ["faulkner", "mccarthy", "sorkin"],
  },
  followers: ["user-2", "user-3", "user-4"],
  following: ["user-2", "user-5"],
  savedCreators: ["hemingway", "carver", "le-guin"],
  readWorks: [
    "sun-also-rises",
    "old-man-sea",
    "what-we-talk-about",
    "left-hand",
  ],
  likedWorks: ["cathedral", "blood-meridian", "dispossessed"],
  favoriteGenres: ["Literary Fiction", "Science Fiction", "Minimalism"],
  eraPreferences: ["1920s-1950s", "1960s-1980s"],
};

// Mock Other Users
export const mockUsers: UserProfile[] = [
  {
    id: "user-2",
    username: "sarahreads",
    displayName: "Sarah Chen",
    bio: "Sci-fi writer and reader. Love speculative fiction!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedAt: new Date("2024-02-01"),
    readingDNA: {
      totalBooks: 89,
      totalAuthors: 45,
      favoriteGenres: [
        { name: "Science Fiction", percentage: 50 },
        { name: "Fantasy", percentage: 30 },
        { name: "Literary Fiction", percentage: 20 },
      ],
      eraBreakdown: [
        { era: "1960s-1980s", count: 25 },
        { era: "1990s-2010s", count: 35 },
        { era: "2020s+", count: 29 },
      ],
      influenceScore: 85,
      literaryDNA: ["Speculative", "Utopian", "Feminist", "Philosophical"],
      topAuthors: ["le-guin", "chiang", "butler"],
      recentlyViewed: ["chiang", "le-guin"],
    },
    followers: ["user-1", "user-3", "user-5", "user-6"],
    following: ["user-1", "user-5"],
    savedCreators: ["le-guin", "chiang"],
    readWorks: ["left-hand", "dispossessed", "stories-of-your-life"],
    likedWorks: ["exhalation"],
    favoriteGenres: ["Science Fiction", "Speculative Fiction"],
    eraPreferences: ["1960s-1980s", "1990s-2010s"],
  },
  {
    id: "user-3",
    username: "minimalist_max",
    displayName: "Max Johnson",
    bio: "Less is more. Into minimalist literature and poetry.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    joinedAt: new Date("2024-01-20"),
    readingDNA: {
      totalBooks: 34,
      totalAuthors: 22,
      favoriteGenres: [
        { name: "Literary Fiction", percentage: 60 },
        { name: "Poetry", percentage: 25 },
        { name: "Short Stories", percentage: 15 },
      ],
      eraBreakdown: [
        { era: "1920s-1950s", count: 15 },
        { era: "1960s-1980s", count: 12 },
        { era: "1990s-2010s", count: 7 },
      ],
      influenceScore: 72,
      literaryDNA: ["Minimalist", "Modernist", "Realist"],
      topAuthors: ["hemingway", "carver", "wolff"],
      recentlyViewed: ["carver", "hemingway"],
    },
    followers: ["user-1", "user-4"],
    following: ["user-1", "user-2"],
    savedCreators: ["hemingway", "carver"],
    readWorks: [
      "sun-also-rises",
      "old-man-sea",
      "what-we-talk-about",
      "cathedral",
    ],
    likedWorks: ["cathedral"],
    favoriteGenres: ["Literary Fiction", "Minimalism"],
    eraPreferences: ["1920s-1950s"],
  },
  {
    id: "user-4",
    username: "screenwriter_sam",
    displayName: "Sam Rivera",
    bio: "Screenwriter exploring the craft through cinema history.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    joinedAt: new Date("2024-03-01"),
    readingDNA: {
      totalBooks: 23,
      totalAuthors: 18,
      favoriteGenres: [
        { name: "Screenwriting", percentage: 70 },
        { name: "Literary Fiction", percentage: 30 },
      ],
      eraBreakdown: [
        { era: "1950s-1970s", count: 10 },
        { era: "1980s-2000s", count: 8 },
        { era: "2000s+", count: 5 },
      ],
      influenceScore: 65,
      literaryDNA: ["Dialogue-heavy", "Satirical", "Political"],
      topAuthors: ["sorkin", "chayefsky"],
      recentlyViewed: ["chayefsky", "sorkin"],
    },
    followers: ["user-5"],
    following: ["user-1", "user-3"],
    savedCreators: ["sorkin", "chayefsky"],
    readWorks: ["west-wing", "social-network", "network"],
    likedWorks: ["network", "social-network"],
    favoriteGenres: ["Screenwriting", "Drama"],
    eraPreferences: ["1950s-1970s"],
  },
  {
    id: "user-5",
    username: "lit_critic_ella",
    displayName: "Ella Thompson",
    bio: "Literary critic and academic. Southern Gothic specialist.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ella",
    joinedAt: new Date("2023-12-01"),
    readingDNA: {
      totalBooks: 156,
      totalAuthors: 89,
      favoriteGenres: [
        { name: "Literary Fiction", percentage: 45 },
        { name: "Southern Gothic", percentage: 35 },
        { name: "Poetry", percentage: 20 },
      ],
      eraBreakdown: [
        { era: "1920s-1950s", count: 45 },
        { era: "1960s-1980s", count: 38 },
        { era: "1990s-2010s", count: 35 },
        { era: "2020s+", count: 38 },
      ],
      influenceScore: 92,
      literaryDNA: ["Gothic", "Modernist", "Experimental", "Southern"],
      topAuthors: ["faulkner", "mccarthy", "hemingway"],
      recentlyViewed: ["faulkner", "mccarthy"],
    },
    followers: ["user-2", "user-4"],
    following: ["user-1", "user-2", "user-3"],
    savedCreators: ["faulkner", "mccarthy", "hemingway"],
    readWorks: [
      "sound-fury",
      "absalom-absalom",
      "blood-meridian",
      "the-road",
      "sun-also-rises",
    ],
    likedWorks: ["blood-meridian", "sound-fury", "absalom-absalom"],
    favoriteGenres: ["Literary Fiction", "Southern Gothic"],
    eraPreferences: ["1920s-1950s", "1960s-1980s"],
  },
];

// Mock Activity Feed
export const mockActivities: Activity[] = [
  {
    id: "act-1",
    userId: "user-2",
    type: "followed_creator",
    targetId: "chiang",
    targetType: "creator",
    targetName: "Ted Chiang",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: "act-2",
    userId: "user-3",
    type: "liked_work",
    targetId: "cathedral",
    targetType: "work",
    targetName: "Cathedral",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "act-3",
    userId: "user-5",
    type: "saved_creator",
    targetId: "faulkner",
    targetType: "creator",
    targetName: "William Faulkner",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: "act-4",
    userId: "user-2",
    type: "read_work",
    targetId: "exhalation",
    targetType: "work",
    targetName: "Exhalation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  {
    id: "act-5",
    userId: "user-4",
    type: "shared_lineage",
    targetId: "sorkin",
    targetType: "creator",
    targetName: "Aaron Sorkin",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: "act-6",
    userId: "user-5",
    type: "followed_user",
    targetId: "user-1",
    targetType: "user",
    targetName: "Alex Reader",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "act-7",
    userId: "user-3",
    type: "followed_creator",
    targetId: "hemingway",
    targetType: "creator",
    targetName: "Ernest Hemingway",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
  },
  {
    id: "act-8",
    userId: "user-2",
    type: "liked_work",
    targetId: "stories-of-your-life",
    targetType: "work",
    targetName: "Stories of Your Life and Others",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28), // 28 hours ago
  },
];

// Social Functions
export function getUserById(userId: string): UserProfile | undefined {
  if (userId === currentUser.id) return currentUser;
  return mockUsers.find((u) => u.id === userId);
}

export function getAllUsers(): UserProfile[] {
  return [currentUser, ...mockUsers];
}

export function followUser(userId: string): boolean {
  if (!currentUser.following.includes(userId)) {
    currentUser.following.push(userId);
    const user = getUserById(userId);
    if (user && !user.followers.includes(currentUser.id)) {
      user.followers.push(currentUser.id);
    }
    return true;
  }
  return false;
}

export function unfollowUser(userId: string): boolean {
  const index = currentUser.following.indexOf(userId);
  if (index > -1) {
    currentUser.following.splice(index, 1);
    const user = getUserById(userId);
    if (user) {
      const followerIndex = user.followers.indexOf(currentUser.id);
      if (followerIndex > -1) {
        user.followers.splice(followerIndex, 1);
      }
    }
    return true;
  }
  return false;
}

export function isFollowing(userId: string): boolean {
  return currentUser.following.includes(userId);
}

export function getFollowers(userId: string): UserProfile[] {
  const user = getUserById(userId);
  if (!user) return [];
  return user.followers
    .map((id) => getUserById(id))
    .filter((u): u is UserProfile => u !== undefined);
}

export function getFollowing(userId: string): UserProfile[] {
  const user = getUserById(userId);
  if (!user) return [];
  return user.following
    .map((id) => getUserById(id))
    .filter((u): u is UserProfile => u !== undefined);
}

export function getActivityFeed(userId?: string): Activity[] {
  // If userId provided, get activities from followed users + own activities
  // Otherwise get global feed
  if (userId) {
    const user = getUserById(userId);
    if (!user) return [];
    const relevantUserIds = [...user.following, userId];
    return mockActivities
      .filter((act) => relevantUserIds.includes(act.userId))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  return [...mockActivities].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function getActivityIcon(type: Activity["type"]): string {
  switch (type) {
    case "followed_user":
      return "👤";
    case "followed_creator":
      return "✨";
    case "liked_work":
      return "❤️";
    case "read_work":
      return "📖";
    case "saved_creator":
      return "🔖";
    case "shared_lineage":
      return "🔗";
    default:
      return "•";
  }
}

export function getActivityText(activity: Activity): string {
  const user = getUserById(activity.userId);
  const userName = user?.displayName || "Someone";

  switch (activity.type) {
    case "followed_user":
      return `${userName} started following ${activity.targetName}`;
    case "followed_creator":
      return `${userName} is now following ${activity.targetName}`;
    case "liked_work":
      return `${userName} liked "${activity.targetName}"`;
    case "read_work":
      return `${userName} read "${activity.targetName}"`;
    case "saved_creator":
      return `${userName} saved ${activity.targetName} to their collection`;
    case "shared_lineage":
      return `${userName} shared ${activity.targetName}'s lineage graph`;
    default:
      return `${userName} did something`;
  }
}

// Save/Unsave creators
export function saveCreator(creatorId: string): boolean {
  if (!currentUser.savedCreators.includes(creatorId)) {
    currentUser.savedCreators.push(creatorId);
    return true;
  }
  return false;
}

export function unsaveCreator(creatorId: string): boolean {
  const index = currentUser.savedCreators.indexOf(creatorId);
  if (index > -1) {
    currentUser.savedCreators.splice(index, 1);
    return true;
  }
  return false;
}

export function isCreatorSaved(creatorId: string): boolean {
  return currentUser.savedCreators.includes(creatorId);
}

// Like/Unlike works
export function likeWork(workId: string): boolean {
  if (!currentUser.likedWorks.includes(workId)) {
    currentUser.likedWorks.push(workId);
    return true;
  }
  return false;
}

export function unlikeWork(workId: string): boolean {
  const index = currentUser.likedWorks.indexOf(workId);
  if (index > -1) {
    currentUser.likedWorks.splice(index, 1);
    return true;
  }
  return false;
}

export function isWorkLiked(workId: string): boolean {
  return currentUser.likedWorks.includes(workId);
}
