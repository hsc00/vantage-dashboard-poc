import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search alerts...",
}: SearchBarProps) => {
  return (
    <div className="relative group">
      <div className={SEARCH_ICON_WRAPPER_CLASSES}>
        <Search size={16} className={SEARCH_ICON_CLASSES} />
      </div>
      <input
        type="text"
        className={INPUT_CLASSES}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={CLEAR_BUTTON_CLASSES}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

const SEARCH_ICON_WRAPPER_CLASSES =
  "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none";

const SEARCH_ICON_CLASSES =
  "text-gray-500 group-focus-within:text-blue-400 transition-colors";

const INPUT_CLASSES = `
  block w-full min-w-[300px] py-1.5 pl-10 pr-8 text-sm text-gray-200 
  bg-[#0f1113] border border-[#2d3135] rounded-md
  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20
  placeholder:text-gray-600 transition-all
`.trim();

const CLEAR_BUTTON_CLASSES = `
  absolute inset-y-0 right-0 flex items-center pr-2 
  text-gray-500 hover:text-gray-300 cursor-pointer 
  transition-colors hover:bg-white/5 rounded-r-md px-2
`.trim();
