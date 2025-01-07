import { createTRPCRouter, publicProcedure } from "./trpc";

import fg from "fast-glob";
import { join } from "path";

import { gamesTable } from "~/db/schema";
import { inArray } from "drizzle-orm";
import { db, updateDatabase } from "~/lib/lib";

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
    const titleIds = userGames.map((game) => game.titleId);

    const games = await db
      .select()
      .from(gamesTable)
      .where(inArray(gamesTable.titleId, titleIds));

    return games;
  }),
});

export type AppRouter = typeof appRouter;
