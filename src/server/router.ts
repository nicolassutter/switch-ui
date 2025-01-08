import { createTRPCRouter, publicProcedure } from "./trpc";

import fg from "fast-glob";
import { join } from "path";
import { stat } from "node:fs/promises";

import { gamesTable } from "~/db/schema";
import { inArray } from "drizzle-orm";
import { db, updateDatabase } from "~/lib/lib";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const USER_GAMES_DIR = import.meta.env.DEV
  ? join(process.cwd(), "games")
  : "/games";

async function fetchUserGames() {
  const files = await fg(join(USER_GAMES_DIR, "**/*.{nsp,xci,nsz}"));
  const regexp = /\[([A-Za-z0-9]{16})\]/;
  const mappedFiles = files
    .map((file) => {
      const match = file.match(regexp);
      const titleId = match?.[1];

      if (!titleId) return;

      return {
        titleId,
        file,
      };
    })
    .filter((g) => !!g);

  return mappedFiles;
}

export const appRouter = createTRPCRouter({
  fetchUserGames: publicProcedure.query(fetchUserGames),
  updateDatabase: publicProcedure.mutation(async () => {
    await updateDatabase();
  }),
  getUserGamesFromDatabase: publicProcedure.query(async () => {
    // Does database have data ?
    const firstGame = await db
      .select({
        titleId: gamesTable.titleId,
      })
      .from(gamesTable)
      .limit(1);
    const hasData = firstGame.length > 0;

    if (!hasData) {
      console.log("Database is empty, updating");
      await updateDatabase();
    }

    const userGames = await fetchUserGames();
    const gamesByTitleId = Object.fromEntries(
      userGames.map((game) => [game.titleId, game])
    );

    const games = await db
      .select()
      .from(gamesTable)
      .orderBy(gamesTable.name)
      .where(inArray(gamesTable.titleId, Object.keys(gamesByTitleId)));

    const promises = games.map(async (game) => {
      const gameFile = gamesByTitleId[game.titleId].file;
      const gameSize = (await stat(gameFile)).size;

      return {
        ...game,
        size: gameSize,
      };
    });

    return await Promise.all(promises);
  }),
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
