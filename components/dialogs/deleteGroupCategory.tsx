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
import { MdDeleteOutline } from "react-icons/md";
import { ICollection } from "@/types";
import { error, getPublicId } from "@/lib/utils";
import { useCollectionStore } from "@/stores/collections";
import { deleteCollectionDB } from "@/lib/actions/collection.action";

export function DeleteGroupCategory({ collection }: { collection: ICollection }) {
  const { deleteCollection } = useCollectionStore();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteCollectionDB(collection.id);
    if (res.ok) {
      deleteCollection(collection.id); // delete from store
      const imagesPublicIds = `${getPublicId(collection.image || collection.icon)},${getPublicId(collection.banner)}`;
      await fetch(`/api/image?public_ids=${imagesPublicIds}`, { method: "DELETE" });
    } else {
      error("Something went wrong");
    }
    setOpen(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 text-red-500 ml-5 hidden group-hover:inline">
        <MdDeleteOutline className="text-xl cursor-pointer" fill="red" onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Delete Collection</DialogTitle>
          <DialogDescription className="text-left">Are you sure you want to delete this group collection?</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive" onClick={handleDelete} className="rounded">
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
