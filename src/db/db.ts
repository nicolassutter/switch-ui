import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/libsql";
import { DB_URL } from "../config";

export const db = drizzle(DB_URL, { schema });
