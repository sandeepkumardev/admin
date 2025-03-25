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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { deleteCategoryDB } from "@/lib/actions/category.action";
import { useCategoryStore } from "@/stores/category";

export function DeleteCategory({ id, name, isGroup = false }: { id: string; name: string; isGroup?: boolean }) {
  const { deleteCategory } = useCategoryStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteCategoryDB(id);
    // @ts-ignore
    deleteCategory(res?.data); // delete from store
    setOpen(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hidden group-hover:inline">
        <MdDeleteOutline className="text-lg cursor-pointer" fill="red" onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Delete {isGroup ? "Group Category" : "Category"}</DialogTitle>
          <DialogDescription className="text-left">
            All the products {isGroup && "and the sub-category"} under this category will be deleted. They cannot be
            recovered.
          </DialogDescription>
        </DialogHeader>

        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="">
            Please type <span className="text-red-500">{name}</span> to confirm
          </Label>
          <Input id="link" placeholder="category name" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive" disabled={input !== name} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
