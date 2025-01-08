import { join } from "node:path";

export const DB_PATH = import.meta.env.DEV
  ? join(process.cwd(), "games.db.sqlite")
  : process.env.DB_PATH ?? "/switch-ui/database.db";

export const DB_URL = `file:${DB_PATH}`;
