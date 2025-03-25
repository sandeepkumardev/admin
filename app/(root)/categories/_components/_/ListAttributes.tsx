// import React, { useRef } from "react";
// import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { IAttribute } from "@/types";
// import { Input } from "@/components/ui/input";
// import { CheckIcon, CircleIcon, Cross1Icon, Cross2Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
// import { Button } from "@/components/ui/button";
// import { addAttributeValueDB, updateAttributeDB } from "@/lib/actions/attribute.action";
// import { error, success } from "@/lib/utils";
// import { DeleteAttribute } from "@/components/dialogs/deleteAttribute";
// import { IoCheckmark } from "react-icons/io5";
// import { useEnumsStore } from "@/stores/enums";
// import { capitalize } from "lodash";

// const ListAttributes = ({ attributes, isLoading }: { attributes: IAttribute[]; isLoading: boolean }) => {
//   return (
//     <Command>
//       <CommandInput placeholder="Type a category or search..." />
//       <CommandList>
//         {isLoading ? <p>Loading...</p> : <CommandEmpty>No results found.</CommandEmpty>}
//         {[{ id: "1", key: "a", value: ["b", "c"] }].map((attribute) => (
//           <Item key={attribute?.id} attribute={attribute} />
//         ))}
//       </CommandList>
//     </Command>
//   );
// };

// const Item = ({ attribute }: { attribute: IAttribute }) => {
//   const { addAttributeValue, updateAttributeKey } = useEnumsStore();
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const [value, setValue] = React.useState<string>("");
//   const [loading, setLoading] = React.useState(false);
//   const [addNew, setAddNew] = React.useState(false);
//   const [edit, setEdit] = React.useState(false);
//   const [key, setKey] = React.useState<string>(attribute.key);

//   const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (value.length < 3) return error("Value name must be at least 3 characters long");
//     if (attribute.value.includes(value)) return error("Value already exists");

//     setLoading(true);
//     const res = await addAttributeValueDB(attribute.key, capitalize(value.trim()));
//     setLoading(false);
//     if (!res?.ok) return error(res?.error || "Something went wrong");

//     addAttributeValue(attribute.key, capitalize(value.trim()));
//     setValue("");
//     success("Value added successfully");
//   };

//   const handleUpdateKey = async () => {
//     if (key.length < 3) return error("Key must be at least 3 characters long");

//     setLoading(true);
//     const res = await updateAttributeDB(attribute.id || "", capitalize(key.trim()));
//     setLoading(false);
//     if (!res?.ok) return error(res?.error || "Something went wrong");

//     updateAttributeKey(attribute.id || "", capitalize(key.trim()));
//     setEdit(false);
//     success("Key updated successfully");
//   };

//   return (
//     <CommandItem className="flex flex-col items-start gap-2 border-b data-[selected=true]:bg-transparent group">
//       <div className="flex justify-between w-full items-center gap-2">
//         {edit ? (
//           <Input value={key} onChange={(e) => setKey(e.target.value)} className="w-full" />
//         ) : (
//           <div className="flex gap-2 items-center">
//             <p className="font-semibold">{attribute.key}</p>
//             <Pencil2Icon className="hidden group-hover:inline w-5 cursor-pointer" onClick={() => setEdit(true)} />
//           </div>
//         )}
//         {edit ? (
//           <div className="flex gap-2">
//             <IoCheckmark className="w-6 h-6 cursor-pointer text-green-600" onClick={handleUpdateKey} />
//             <Cross2Icon className="w-6 h-6 cursor-pointer text-red-600" onClick={() => setEdit(false)} />
//           </div>
//         ) : (
//           <DeleteAttribute id={attribute?.id as string} type="key" />
//         )}
//       </div>
//       <div className="flex gap-2 px-1">
//         {attribute.value?.length === 0 && <p className="">No values</p>}
//         {attribute.value?.map((value) => (
//           <p key={value} className="border font-semibold px-2 rounded-full flex items-center gap-2 pr-1">
//             {value}{" "}
//             <DeleteAttribute id={attribute?.id as string} type="value" values={attribute.value.filter((v) => v !== value)} />
//           </p>
//         ))}
//         <p
//           className={`cursor-pointer bg-green-700 px-2 rounded-full text-white flex items-center gap-1 ${
//             addNew && "hidden"
//           }`}
//           onClick={() => {
//             setAddNew(true);
//             inputRef?.current?.focus();
//           }}
//         >
//           <PlusIcon /> Add
//         </p>
//       </div>

//       <form onSubmit={handleAdd} className={`w-full flex items-center gap-3 ${!addNew && "h-0 overflow-hidden"}`}>
//         <Input
//           ref={inputRef}
//           type="text"
//           className=""
//           placeholder="Add attribute value"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//         />
//         <Button
//           size={"icon"}
//           className="px-2 rounded-full bg-red-500 hover:bg-red-700"
//           onClick={() => {
//             setAddNew(false);
//             setValue("");
//           }}
//           type="button"
//         >
//           <Cross1Icon className="w-6 h-6" />
//         </Button>
//         <Button size={"icon"} disabled={loading || value === ""} className="px-2 rounded-full bg-green-700" type="submit">
//           {loading ? <CircleIcon className="w-7 h-7 animate-spin" /> : <CheckIcon className="w-7 h-7" />}
//         </Button>
//       </form>
//     </CommandItem>
//   );
// };

// export default ListAttributes;
