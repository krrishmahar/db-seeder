// prisma.config.ts (move this to project root, not inside prisma/)
import "dotenv/config";
import path from "node:path";
import { defineConfig } from 'prisma/config'

const config = {
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "ts-node --esm prisma/seed.ts",
    },
    views: {
      path: path.join("prisma", "views"),
    },
    typedSql: {
      path: path.join("prisma", "queries"),
    }
};
export default defineConfig(config);