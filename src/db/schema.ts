import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
// import type { Game } from "../../types";

export const gamesTable = sqliteTable("games", {
  id: int().primaryKey({ autoIncrement: true }),
  titleId: text().unique().notNull(),
  name: text().notNull(),
  bannerUrl: text(),
  releaseDate: text(),
  category: text({ mode: "json" }).$type<string[]>(),
});
