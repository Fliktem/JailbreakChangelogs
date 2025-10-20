"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface OGItem {
  tradePopularMetric: number;
  level: number | null;
  timesTraded: number;
  id: string;
  categoryTitle: string;
  info: Array<{
    title: string;
    value: string;
  }>;
  uniqueCirculation: number;
  season: number | null;
  title: string;
  isOriginalOwner: boolean;
  user_id: string;
  logged_at: number;
  history?: string | Array<{ UserId: number; TradeTime: number }>;
}

interface OGSearchData {
  results: OGItem[];
  count: number;
  search_id: string;
  search_time: number;
}

interface OGFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  initialData: OGSearchData | null;
}

export default function OGFilters({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  sortOrder,
  setSortOrder,
  initialData,
}: OGFiltersProps) {
  const MAX_SEARCH_LENGTH = 50;

  // Get available categories
  const availableCategories = initialData?.results
    ? Array.from(
        new Set(initialData.results.map((item) => item.categoryTitle)),
      ).sort()
    : [];

  // Check if there are any duplicates in the data
  const hasDuplicates = initialData?.results
    ? (() => {
        const itemCounts = new Map<string, number>();
        initialData.results.forEach((item) => {
          const key = `${item.categoryTitle}-${item.title}`;
          itemCounts.set(key, (itemCounts.get(key) || 0) + 1);
        });
        return Array.from(itemCounts.values()).some((count) => count > 1);
      })()
    : false;

  return (
    <div className="border-border-primary bg-secondary-bg shadow-card-shadow rounded-lg border p-6">
      <h2 className="text-primary-text mb-4 text-xl font-semibold">
        Filter & Sort
      </h2>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        {/* Search Bar */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxLength={MAX_SEARCH_LENGTH}
            className="text-primary-text border-border-primary bg-primary-bg placeholder-secondary-text focus:border-button-info min-h-[56px] w-full rounded-lg border px-4 py-3 pr-10 pl-10 transition-all duration-300 focus:outline-none"
          />
          <MagnifyingGlassIcon className="text-secondary-text absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="hover:text-primary-text text-secondary-text absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 cursor-pointer"
              aria-label="Clear search"
            >
              <XMarkIcon />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-1/3">
          <select
            className="select w-full bg-primary-bg text-primary-text min-h-[56px]"
            value={selectedCategories.length > 0 ? selectedCategories[0] : ""}
            onChange={(e) => {
              if (e.target.value === "") {
                setSelectedCategories([]);
              } else {
                setSelectedCategories([e.target.value]);
              }
            }}
          >
            <option value="">All categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-1/3">
          <select
            className="select w-full bg-primary-bg text-primary-text min-h-[56px]"
            value={sortOrder}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSortOrder(e.target.value)
            }
          >
            {hasDuplicates && (
              <option value="duplicates">Group Duplicates</option>
            )}
            <option disabled>Date</option>
            <option value="created-desc">Logged On (Newest to Oldest)</option>
            <option value="created-asc">Logged On (Oldest to Newest)</option>
            <option disabled>Alphabetically</option>
            <option value="alpha-asc">Name (A to Z)</option>
            <option value="alpha-desc">Name (Z to A)</option>
            <option disabled>Activity</option>
            <option value="traded-desc">Monthly Traded (High to Low)</option>
            <option value="unique-desc">Monthly Unique (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
