import { Component } from "solid-js";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: Component<SearchBarProps> = (props) => {
  return (
    <div class="mb-6 flex justify-center">
      <input
        type="text"
        placeholder="Search games..."
        onInput={(e) => props.onSearch(e.currentTarget.value)}
        class="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
