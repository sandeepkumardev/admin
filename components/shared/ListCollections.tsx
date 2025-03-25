import React from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ICollection } from "@/types";
import { DeleteGroupCategory } from "../dialogs/deleteGroupCategory";
import Link from "next/link";

const ListCollections = ({ collections, isLoading }: { collections: ICollection[]; isLoading: boolean }) => {
  return (
    <Command className="h-full max-h-[400px]">
      <CommandInput placeholder="Type a collection or search..." />
      <CommandList>
        {isLoading ? <p>Loading...</p> : <CommandEmpty>No results found.</CommandEmpty>}

        {collections?.map((collection: ICollection) => (
          <CommandItem key={collection.id} className="group">
            <Link href={`/cl/${collection.id}`} className="text-[15px] w-full flex items-center gap-3">
              <p>{collection.name}</p>
              {!collection.isActive && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 rounded-2xl px-2">inactive</span>
              )}
            </Link>
            <DeleteGroupCategory collection={collection} />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default ListCollections;
