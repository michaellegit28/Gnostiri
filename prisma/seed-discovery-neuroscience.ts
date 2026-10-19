// Seed (standalone runner): Discovery Lab — Neuroscience deep conceptual content.
// Logic lives in prisma/discovery-seed-lib.ts (shared with the canonical seed).
//
// Usage: npx ts-node prisma/seed-discovery-neuroscience.ts
// (Requires a connected database; see STATE.md deploy steps.)

import { PrismaClient } from "@prisma/client";
import { seedDiscoveryNeuroscience } from "./discovery-seed-lib";

const prisma = new PrismaClient();

async function main() {
  await seedDiscoveryNeuroscience(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
