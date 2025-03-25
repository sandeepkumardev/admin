import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { MdDeleteOutline } from "react-icons/md";
import { deleteAttributeDB, deleteAttributeValueDB } from "@/lib/actions/attribute.action";
import { useEnumsStore } from "@/stores/enums";

export function DeleteAttribute({
  id,
  type,
  values,
  productTypeId,
}: {
  id: string;
  type: "key" | "value";
  values?: string[];
  productTypeId: string;
}) {
  const { removeAttributeKey, removeAttributeValue } = useEnumsStore();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    let res;
    if (type === "key") {
      res = await deleteAttributeDB(id);
      if (res.ok) removeAttributeKey(id, productTypeId);
    }
    if (type === "value") {
      res = await deleteAttributeValueDB(id, values || []);
      if (res.ok) removeAttributeValue(id, values || [], productTypeId);
    }
    setOpen(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${type === "key" && "hidden group-hover:inline"}`}>
        {type === "value" ? (
          <Cross2Icon className="cursor-pointer text-red-600" onClick={() => setOpen(true)} />
        ) : (
          <MdDeleteOutline className="text-lg cursor-pointer" fill="red" onClick={() => setOpen(true)} />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Delete {type === "value" ? "Value" : "Attribute"}</DialogTitle>
          <DialogDescription className="text-left">Are you sure you want to delete this?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
