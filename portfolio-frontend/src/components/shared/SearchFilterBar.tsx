import { Search } from "lucide-react";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  placeholder?: string;
}

export function SearchFilterBar({
  search,
  onSearchChange,
  tags,
  activeTag,
  onTagChange,
  placeholder = "Search…",
}: SearchFilterBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="relative">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder.replace(/…$/, "")}
          className="w-full rounded-md border border-navy-600 bg-navy-800/60 py-2.5 pl-9 pr-3 font-mono text-sm text-paper placeholder:text-paper-faint focus:border-sea-400"
        />
      </div>

      {tags.length > 0 && (
        <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onTagChange(null)}
            aria-pressed={activeTag === null}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
              activeTag === null
                ? "border-magenta-500 bg-magenta-500/10 text-magenta-400"
                : "border-navy-600 text-paper-dim hover:text-paper"
            }`}
          >
            all
          </button>
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => onTagChange(tag)}
              aria-pressed={activeTag === tag}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                activeTag === tag
                  ? "border-magenta-500 bg-magenta-500/10 text-magenta-400"
                  : "border-navy-600 text-paper-dim hover:text-paper"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
