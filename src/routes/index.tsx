import { createAsync, query, revalidate } from "@solidjs/router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const ColorMode = clientOnly(() => import("~/components/ColorMode"));

const getUserGames = query(async () => {
  "use server";
  return api.getUserGamesFromDatabase.query();
}, "getUserGames");

export default function Index() {
  const [searchQuery, setSearchQuery] = createSignal("");

  const userGames = createAsync(() => getUserGames());

  /** Every category that exists for the user's library */
  const availableCategories = () => {
    return (
      userGames()?.reduce((acc, game) => {
        game.category?.forEach((category) => {
          if (!acc.includes(category)) acc.push(category);
        });
        return acc;
      }, [] as string[]) ?? []
    );
  };

  const [selectedCategory, setSelectedCategory] = createSignal<
    string | undefined
  >();

  const filteredGames = () => {
    const query = searchQuery().toLowerCase();

    let games = userGames();

    // first filter by category if selected
    if (selectedCategory()) {
      games = games?.filter((game) =>
        game.category?.includes(selectedCategory()!)
      );
    }

    // then filter by name to reduce the number of games to display
    return (
      games?.filter((game) => game.name.toLowerCase().includes(query)) ?? []
    );
  };

  const refetchGames = () => {
    return revalidate(getUserGames.key);
  };

  const { pending: updateDatabasePending, start: updateDatabase } = usePromise(
    async () => {
      await api.updateDatabase.mutate();
      await refetchGames();
    }
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
              <Show when={updateDatabasePending()}>
                <span class="i-mingcute-loading-fill ml-2 animate-spin"></span>
                <span class="sr-only">loading</span>
              </Show>
            </Button>
          </div>

          <TextFieldRoot class="mt-6">
            <TextFieldLabel>Search</TextFieldLabel>
            <TextField
              type="text"
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </TextFieldRoot>

          <div class="w-56 max-w-full mt-2">
            <Select
              options={availableCategories()}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
              onChange={(cat) => {
                setSelectedCategory(cat ?? undefined);
              }}
            >
              <SelectLabel>Categories</SelectLabel>
              <SelectTrigger>
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>

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
