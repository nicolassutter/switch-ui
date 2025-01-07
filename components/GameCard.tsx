import { Component, onMount, Show } from "solid-js";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
}

const GameCard: Component<GameCardProps> = (props) => {
  const date = props.game.releaseDate ? new Date(props.game.releaseDate) : null;
  const year = date?.getFullYear();
  const month = date?.getMonth() ? `0${date?.getMonth() + 1}`.slice(-2) : "";
  const day = date?.getDate() ? `0${date?.getDate()}`.slice(-2) : "";

  return (
    <div class="bg-accent rounded-lg shadow-lg overflow-hidden border border-muted">
      <Show when={props.game.bannerUrl}>
        <img src={props.game.bannerUrl!} class="w-full h-48 object-cover" />
      </Show>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2 text-accent-foreground">
          {props.game.name}
        </h3>
        <p class="text-sm text-muted-foreground">
          Genre: {props.game.category?.join(", ")}
        </p>
        <p class="text-sm text-muted-foreground">
          Released: {year}/{month}/{day}
        </p>
      </div>
    </div>
  );
};

export default GameCard;
