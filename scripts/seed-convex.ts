import { config } from "dotenv";

config({ path: ".env.local" });

/**
 * Seed ALL static data from lib/data.ts into Convex.
 *
 * Since seed mutations are now internalMutation (not callable from client),
 * use the Convex CLI to run them:
 *
 *   npx convex run seed:clearAll          # wipe existing data
 *   npx convex run seed:seedDatabase      # seed from built-in data
 *   npx convex run seed:seedBatch '{"creators": [...]}'  # seed a batch
 *
 * Or run this script which uses the internal function runner:
 *   npx convex dev                         # in one terminal
 *   npx tsx scripts/seed-convex.ts --clear  # in another
 *
 * Options:
 *   --clear   Wipe existing creators/works before seeding
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { creators } from "../lib/data";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Make sure .env.local exists.",
  );
  process.exit(1);
}

console.log(
  "Note: Seed mutations are now internal. Use `npx convex run` to invoke them directly:",
);
console.log("  npx convex run seed:clearAll");
console.log("  npx convex run seed:seedDatabase");
console.log("");
console.log(`Total creators in static data: ${creators.length}`);
console.log(
  "Run `npx convex run seed:resetAndSeed` to clear and reseed all data.",
);
