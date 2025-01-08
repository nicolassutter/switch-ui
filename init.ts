import { writeFile } from "node:fs/promises";
import { DB_PATH } from "./src/config";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./src/db/db";

async function init() {
  try {
    const exists = existsSync(DB_PATH);

    if (!exists) {
      console.log("Creating database file");
      await writeFile(DB_PATH, "");
    }

    try {
      console.log("Migrating database");
      await migrate(db, {
        migrationsFolder: join(process.cwd(), "drizzle"),
      });
      console.log("Database migrated");
    } catch (error) {
      console.log("failed to migrate", error);
    }
  } catch (error) {
    console.log("Could not initialize app, exiting", error);
    process.exit(1);
  }
}

init();
