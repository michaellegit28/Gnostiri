// Seed (standalone runner): Discovery Lab — Physics deep conceptual content.
// Logic lives in prisma/discovery-seed-lib.ts (shared with the canonical seed).
//
// Usage: npx ts-node prisma/seed-discovery-physics.ts
// (Requires a connected database; see STATE.md deploy steps.)

import { PrismaClient } from "@prisma/client";
import { seedDiscoveryPhysics } from "./discovery-seed-lib";

const prisma = new PrismaClient();

async function main() {
  await seedDiscoveryPhysics(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
