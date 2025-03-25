"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ICategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { DeleteCategory } from "@/components/dialogs/deleteCategory";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleIcon, Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { IoCheckmark } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { createSlug, error } from "@/lib/utils";
import { updateCategoryNameDB } from "@/lib/actions/category.action";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";

const ListCatgorires = ({ isLoading, allCategories }: { isLoading: boolean; allCategories: ICategory[] }) => {
  const { categories } = useCategoryStore();
  return (
    <Command className="h-full max-h-[400px]">
      <div className="flex gap-3">
        <div className="w-full flex-1">
          <CommandInput placeholder={isLoading ? "Loading..." : "Search sub-category..."} />
        </div>
      </div>
      <CommandList>
        {isLoading ? (
          <CommandEmpty className="flex flex-col gap-5 mt-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-[20px] rounded-full" />
            ))}
          </CommandEmpty>
        ) : (
          <CommandEmpty>No sub-category found.</CommandEmpty>
        )}
        <CommandGroup>
          {categories?.map((category) => (
            <div key={category.id}>
              <Item category={category} />
              {category?.children?.map((child) => (
                <Item key={child.id} category={child} />
              ))}
            </div>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const Item = ({ category }: { category: ICategory }) => {
  const isGroup = category?.parentId ? false : true;
  const [edit, setEdit] = React.useState(false);
  const [name, setName] = React.useState<string>(category.name);
  const { updateCategoryName } = useCategoryStore();
  const [loading, setLoading] = React.useState(false);

  const handleUpdate = async () => {
    if (name.length < 3) return error("Name must be at least 3 characters");

    setLoading(true);
    const res = await updateCategoryNameDB(category.id || "", capitalize(name), createSlug(name));
    setLoading(false);
    if (!res.ok) return error(res.error || "Something went wrong");

    updateCategoryName(category.id || "", capitalize(name), createSlug(name), isGroup);
    setEdit(false);
  };

  return (
    <CommandItem key={category.id} className="flex justify-between group">
      {edit ? (
        <>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mr-2" />
          <div className="flex gap-2">
            {loading ? (
              <CircleIcon className="w-6 h-6 animate-spin" />
            ) : (
              <IoCheckmark className="w-6 h-6 cursor-pointer text-green-600" onClick={handleUpdate} />
            )}
            <Cross2Icon className="w-6 h-6 cursor-pointer text-red-600" onClick={() => setEdit(false)} />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <p>{category.name}</p>
            {isGroup && (
              <Badge variant="outline" className="ml-2 text-light-3">
                Group
              </Badge>
            )}
            <Pencil2Icon
              id="edit"
              className="hidden group-hover:inline w-5 cursor-pointer ml-2"
              onClick={() => setEdit(true)}
            />
          </div>
          <DeleteCategory id={category.id} name={category.name} isGroup={isGroup} />
        </>
      )}
    </CommandItem>
  );
};

export default ListCatgorires;
