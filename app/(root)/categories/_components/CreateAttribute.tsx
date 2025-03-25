import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createAttribute } from "@/lib/actions/attribute.action";
import { error, success } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { IAttribute } from "@/types";
import { capitalize } from "lodash";
import { CheckIcon, CircleIcon, PlusCircle } from "lucide-react";
import React, { useRef } from "react";

const CreateAttribute = ({ productTypeId }: { productTypeId: string }) => {
  const { addAttributeKey } = useEnumsStore();
  const [open, setOpen] = React.useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.length < 3) return error("Value name must be at least 3 characters long");

    setLoading(true);
    const res = await createAttribute(capitalize(value.trim()), productTypeId);
    setLoading(false);
    if (!res?.ok) return error(res?.error || "Something went wrong");

    addAttributeKey(res?.data as IAttribute, productTypeId);
    success("Attribute added successfully");
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PlusCircle
          className="w-[18px] h-[18px] cursor-pointer text-green-600"
          onClick={() => {
            setOpen(true);
            inputRef?.current?.focus();
          }}
        />
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add Attribute</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAdd} className={`w-full flex items-center gap-1 my-1`}>
          <Input
            ref={inputRef}
            type="text"
            className="rounded"
            placeholder="Add attribute name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button size={"icon"} disabled={loading || value === ""} className="px-2 rounded bg-green-700" type="submit">
            {loading ? <CircleIcon className="w-7 h-7 animate-spin" /> : <CheckIcon className="w-7 h-7" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAttribute;
