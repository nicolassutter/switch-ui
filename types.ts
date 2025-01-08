import { type RouterOutput } from "~/server/router";

export type Game = RouterOutput["getUserGamesFromDatabase"][number];

export type RawGame = {
  id?: string;
  name: string;
  bannerUrl?: string;
  releaseDate?: number;
  category?: string[];
};
