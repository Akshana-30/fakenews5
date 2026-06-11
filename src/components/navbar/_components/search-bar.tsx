"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/article?search=${(query)}`);
  }

  return (
    <form onSubmit={handleSearch}>
      <InputGroup className=" h-6 bg-white/70 dark:text-white text-black rounded-2xl">
        <InputGroupInput
          placeholder="Article, author or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon>
          <button type="submit">
            <SearchIcon />
          </button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
