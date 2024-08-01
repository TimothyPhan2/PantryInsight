import { Input } from "@/components/ui/input";

import { SearchIcon } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative flex-1 md:grow-0">
      <SearchIcon className="absolute left-2.5 top-3/4 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[400px] mt-20"
      />
    </div>
  );
}
