import { gamesTable } from "~/db/schema";
import { RawGame } from "../../types";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "~/db/schema";

export const db = drizzle(process.env.DB_FILE_NAME!, { schema });

const GAMES_DATABASE_URL =
  "https://raw.githubusercontent.com/blawar/titledb/master/US.en.json";

export const fetchGames = async () => {
  console.log("Querying games");
  console.time("fetchGames");

  try {
    const data: Record<string, RawGame> = await fetch(GAMES_DATABASE_URL).then(
      (response) => response.json()
    );

    console.log("Games fetched");
    console.timeEnd("fetchGames");
    return data;
  } catch (error) {
    console.error("Error fetching games", error);
    console.timeEnd("fetchGames");
    throw error;
  }
};

export async function updateDatabase() {
  try {
    const games = await fetchGames();

    console.log("Updating database");
    console.time("updateDatabase");

    await db.transaction(async (tx) => {
      for (const rawGame of Object.values(games)) {
        if (!rawGame.id) continue;

        let year, month, day;

        if (rawGame.releaseDate) {
          const date = `${rawGame.releaseDate}`;
          year = Number(date.slice(0, 4));
          month = Number(date.slice(4, 6));
          day = Number(date.slice(6, 8));
        }

        const game: typeof gamesTable.$inferInsert = {
          bannerUrl: rawGame.bannerUrl,
          category: rawGame.category,
          name: rawGame.name,
          releaseDate:
            year && month && day
              ? new Date(year, month, day).toISOString()
              : null,
          titleId: rawGame.id,
        };

        await tx.insert(gamesTable).values(game).onConflictDoUpdate({
          target: gamesTable.titleId,
          set: game,
        });
      }
    });

    console.log("Database updated");
    console.timeEnd("updateDatabase");
  } catch (error) {
    console.error("Error updating database", error);
  }
}
