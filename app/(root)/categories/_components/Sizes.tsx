"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { error, success } from "@/lib/utils";
import { ISize } from "@/types";
import { createSizeDB } from "@/lib/actions/size.action";
import { DeleteSize } from "@/components/dialogs/deleteSize";
import { useEnumsStore } from "@/stores/enums";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { capitalize } from "lodash";
import { CheckIcon, CircleIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";

const Sizes = ({
  sizes: data,
  sizeCategories,
  isLoading,
}: {
  sizes: ISize[];
  sizeCategories: string[];
  isLoading: boolean;
}) => {
  const { setsizes, sizes } = useEnumsStore();

  useEffect(() => {
    if (sizes.length === 0) setsizes(data || []);
  }, []);

  return (
    <div className="px-2 flex flex-col gap-2 pt-[1px]">
      {isLoading && <p className="">Loading...</p>}
      {sizes.map((item, index) => (
        <Item key={index} item={item} />
      ))}

      {sizeCategories.length !== sizes.length && (
        <Select onValueChange={(v) => setsizes([...sizes, { id: "", type: v, value: [] }])}>
          <SelectTrigger className="w-full">
            <p>Select the size category</p>
          </SelectTrigger>
          <SelectContent>
            {sizeCategories
              .filter((item) => !sizes.map((i) => i.type).includes(item))
              .map((item) => (
                <SelectItem key={item} value={item}>
                  {capitalize(item)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

const Item = ({ item }: { item: ISize }) => {
  const { addSize } = useEnumsStore();
  const [loading, setLoading] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    if (value === "") return error("Size is required");

    setLoading(true);
    const res = await createSizeDB(type, value.trim());
    setLoading(false);
    if (!res?.ok) return error(res?.error);
    addSize(type, value);
    success("Size added successfully");
    setValue("");
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-base font-semibold">{capitalize(item.type)}</p>
      <div className="px-1">
        {item.value?.length === 0 && <p className="">No values</p>}
        <div className="flex gap-2 flex-wrap">
          {item.value?.map((value) => (
            <p key={value} className="border font-semibold px-2 rounded-full flex items-center gap-2">
              {value} <DeleteSize type={item.type} values={item.value.filter((v) => v !== value)} />
            </p>
          ))}
          <p
            className={`cursor-pointer bg-green-700 px-2 rounded-full text-white flex items-center gap-1 ${
              addNew && "hidden"
            }`}
            onClick={() => {
              setAddNew(true);
              inputRef?.current?.focus();
            }}
          >
            <PlusIcon /> Add
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => handleAdd(e, item.type)}
        className={`w-full flex items-center gap-3 ${!addNew && "h-0 overflow-hidden"}`}
      >
        <Input
          ref={inputRef}
          type={item.type === "numeric" ? "number" : "text"}
          className=""
          placeholder={
            item.type === "numeric" ? "28, 30, 32, 34" : item.type === "standard" ? "XS, S, M, L" : "UK6, UK7, UK8"
          }
          value={value}
          onChange={(e) => {
            if (e.target.value.includes(" ")) return;
            if (e.target.value.length > 4) return error("Max 4 characters");
            setValue(e.target.value.toUpperCase());
          }}
        />
        <Button
          size={"icon"}
          className="px-2 rounded-full bg-red-500 hover:bg-red-700"
          onClick={() => {
            setAddNew(false);
            setValue("");
          }}
          type="button"
        >
          <Cross1Icon className="w-6 h-6" />
        </Button>
        <Button size={"icon"} disabled={loading || value === ""} className="px-2 rounded-full bg-green-700" type="submit">
          {loading ? <CircleIcon className="w-7 h-7 animate-spin" /> : <CheckIcon className="w-7 h-7" />}
        </Button>
      </form>
    </div>
  );
};

export default Sizes;
