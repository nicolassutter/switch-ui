import { createAsync } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import GameCard from "../../components/GameCard";
import SearchBar from "../../components/SearchBar";
import { api } from "~/lib/trpc";
import { usePromise } from "~/lib/primitives";

export default function Index() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const userGames = createAsync(() => api.getUserGamesFromDatabase.query());

  const filteredGames = () => {
    const query = searchQuery().toLowerCase();

    return (
      userGames()?.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.category?.join(" ").toLowerCase().includes(query)
      ) ?? []
    );
  };

  const { pending, start: updateDatabase } = usePromise(() =>
    api.updateDatabase.mutate()
  );

  return (
    <main>
      <div class="min-h-screen bg-gray-900 p-8">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl font-bold mb-8 text-center text-white">
            Nintendo Switch Games
          </h1>

          <button
            class="text-white cursor-pointer underline hover:opacity-80"
            on:click={() => updateDatabase()}
          >
            Update database
            <Show when={pending()}>loading...</Show>
          </button>

          <SearchBar onSearch={setSearchQuery} />

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={filteredGames()}>
              {(game) => <GameCard game={game} />}
            </For>
          </div>
        </div>
      </div>
    </main>
  );
}
