import { gamesTable } from "~/db/schema";

export type Game = typeof gamesTable.$inferInsert;

export type RawGame = {
  id?: string;
  name: string;
  bannerUrl?: string;
  releaseDate?: number;
  category?: string[];
};
