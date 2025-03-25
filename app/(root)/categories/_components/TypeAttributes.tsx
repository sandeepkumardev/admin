import React, { useRef } from "react";
import { IAttribute, IType } from "@/types";
import { Input } from "@/components/ui/input";
import { CheckIcon, CircleIcon, Cross1Icon, Cross2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { addAttributeValueDB, updateAttributeDB } from "@/lib/actions/attribute.action";
import { error, success } from "@/lib/utils";
import { DeleteAttribute } from "@/components/dialogs/deleteAttribute";
import { IoCheckmark } from "react-icons/io5";
import { useEnumsStore } from "@/stores/enums";
import { capitalize } from "lodash";
import { DeleteType } from "@/components/dialogs/deleteType";
import { Separator } from "@/components/ui/separator";
import CreateAttribute from "./CreateAttribute";
import { updateProductTypeDB } from "@/lib/actions/type.action";
import { useTypes } from "@/hook/useTypes";

const TypeAttributes = () => {
  const { types, fetchingTypes: isLoading } = useTypes();

  if (isLoading) {
    return <p className="text-gray-500 mt-2">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      {types?.map((type) => (
        <Item key={type?.id} type={type} />
      ))}
    </div>
  );
};

const Item = ({ type }: { type: IType }) => {
  const { updateType } = useEnumsStore();
  const [value, setValue] = React.useState<string>(type.name);
  const [edit, setEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length < 3) return error("Key must be at least 3 characters long");

    setLoading(true);
    const res = await updateProductTypeDB(type.id, capitalize(value.trim()));
    setLoading(false);
    if (!res?.ok) return error(res?.error || "Something went wrong");

    updateType(type.id, capitalize(value.trim()));
    setEdit(false);
    success("Key updated successfully");
  };

  return (
    <div className="flex flex-col items-start gap-2 border-b p-1 data-[selected=true]:bg-transparent group border rounded">
      {edit ? (
        <form onSubmit={handleUpdateName} className="flex w-full items-center gap-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-2 h-7" />
          <div className="flex gap-2">
            {loading ? (
              <CircleIcon className="w-5 h-5 animate-spin" />
            ) : (
              <IoCheckmark className="w-5 h-5 cursor-pointer text-green-600" type="submit" />
            )}
            <Cross2Icon className="w-5 h-5 cursor-pointer text-red-600" onClick={() => setEdit(false)} />
          </div>
        </form>
      ) : (
        <div className="flex justify-between w-full items-center gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-semibold">{type.name}</p>
            <Pencil2Icon className="hidden group-hover:inline w-5 cursor-pointer" onClick={() => setEdit(true)} />
          </div>
          <div className="flex gap-2 items-center">
            <DeleteType id={type.id} />
            <CreateAttribute productTypeId={type.id} />
          </div>
        </div>
      )}

      <Separator />

      {!type.attributes ||
        (type.attributes?.length === 0 && <p className="text-gray-400 text-xs text-nowrap">No attributes</p>)}

      {type.attributes?.map((attribute) => (
        <AttributeItem key={attribute.id} attribute={attribute} productTypeId={type.id} />
      ))}
    </div>
  );
};

const AttributeItem = ({ attribute, productTypeId }: { attribute: IAttribute; productTypeId: string }) => {
  const { addAttributeValue, updateAttributeKey } = useEnumsStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [addNew, setAddNew] = React.useState(false);
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [key, setKey] = React.useState<string>(attribute.key);
  const [edit, setEdit] = React.useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const res = await addAttributeValueDB(attribute.id, capitalize(value.trim()));
    setLoading(false);

    if (!res?.ok) return error(res?.error || "Something went wrong");

    addAttributeValue(attribute.id, capitalize(value.trim()), productTypeId);
    success("Value added successfully");
    setValue("");
    setAddNew(false);
  };

  const handleUpdateKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (key.length < 3) return error("Key must be at least 3 characters long");

    setLoading(true);
    const res = await updateAttributeDB(attribute.id, key.trim());
    setLoading(false);
    if (!res?.ok) return error(res?.error || "Something went wrong");

    updateAttributeKey(attribute.id, key.trim(), productTypeId);
    success("Key updated successfully");
    setEdit(false);
  };

  return (
    <div className="border p-1 w-full rounded flex flex-col gap-1 group">
      {edit ? (
        <form onSubmit={handleUpdateKey} className="flex w-full items-center gap-2">
          <Input value={key} onChange={(e) => setKey(e.target.value)} className="w-full px-2 h-7" />
          <div className="flex gap-2">
            {loading ? (
              <CircleIcon className="w-5 h-5 animate-spin" />
            ) : (
              <IoCheckmark className="w-5 h-5 cursor-pointer text-green-600" type="submit" />
            )}
            <Cross2Icon className="w-5 h-5 cursor-pointer text-red-600" onClick={() => setEdit(false)} />
          </div>
        </form>
      ) : (
        <div className="flex justify-between w-full items-center gap-2">
          <div className="flex gap-2 items-center">
            <p className="font-semibold text-[14px]">{attribute.key}</p>
            <Pencil2Icon className="hidden group-hover:inline w-5 cursor-pointer" onClick={() => setEdit(true)} />
          </div>
          <div className="flex gap-2 items-center">
            <DeleteAttribute id={attribute?.id as string} type="key" productTypeId={productTypeId} />
          </div>
        </div>
      )}

      {attribute.value.length === 0 && <p className="text-gray-400 text-xs text-nowrap">No values</p>}

      <div className="flex flex-wrap gap-1">
        {attribute.value.map((value) => (
          <p key={value} className="border font-semibold px-2 text-xs rounded-full flex items-center gap-2 pr-1">
            {value}{" "}
            <DeleteAttribute
              id={attribute?.id as string}
              type="value"
              values={attribute.value.filter((v) => v !== value)}
              productTypeId={productTypeId}
            />
          </p>
        ))}

        <span
          className={`cursor-pointer bg-green-700 text-xs rounded-full text-white flex items-center gap-1 ${
            addNew ? "hidden" : "px-2"
          }`}
          onClick={() => {
            setAddNew(true);
            inputRef?.current?.focus();
          }}
        >
          <PlusIcon /> Add
        </span>
      </div>

      <form onSubmit={handleAdd} className={`w-full flex items-center gap-1 ${!addNew && "h-0 overflow-hidden"}`}>
        <Input
          ref={inputRef}
          type="text"
          className="rounded"
          placeholder="Add attribute value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          size={"icon"}
          className="px-2 rounded bg-red-500 hover:bg-red-700"
          onClick={() => {
            setAddNew(false);
            setValue("");
          }}
          type="button"
        >
          <Cross1Icon className="w-6 h-6" />
        </Button>
        <Button size={"icon"} disabled={loading || value === ""} className="px-2 rounded bg-green-700" type="submit">
          {loading ? <CircleIcon className="w-7 h-7 animate-spin" /> : <CheckIcon className="w-7 h-7" />}
        </Button>
      </form>
    </div>
  );
};

export default TypeAttributes;
