import { createAsync } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import GameCard from "../../components/GameCard";
import { api } from "~/lib/trpc";
import { usePromise } from "~/lib/primitives";
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { clientOnly } from "@solidjs/start";

const ColorMode = clientOnly(() => import("~/components/ColorMode"));

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
      <div class="min-h-screen bg-background text-foreground">
        <div class="max-w-6xl mx-auto py-6 px-4">
          <h1 class="text-3xl font-bold mb-8 text-center">
            Nintendo Switch Games
          </h1>

          <div>
            <span class="sr-only">Select color theme</span>
            <ColorMode />
          </div>

          <div class="mt-6">
            <Button variant={"default"} onClick={() => updateDatabase()}>
              Update database
              <Show when={pending()}> loading...</Show>
            </Button>
          </div>

          <TextFieldRoot class="mt-6">
            <TextFieldLabel>Search</TextFieldLabel>
            <TextField
              type="text"
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </TextFieldRoot>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <For each={filteredGames()}>
              {(game) => <GameCard game={game} />}
            </For>
          </div>
        </div>
      </div>
    </main>
  );
}
