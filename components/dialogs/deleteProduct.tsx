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
import { deleteProductDB } from "@/lib/actions/product.action";
import { useProductStore } from "@/stores/product";

export function DeleteProduct({ id }: { id: string }) {
  const { deleteProdct } = useProductStore();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteProductDB(id);
    if (res.ok) await fetch(`/api/image?public_ids=${res.imagesPublicIds}`, { method: "DELETE" });
    deleteProdct(id); // delete from store
    setIsDeleting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-red-500 w-full">
        <div className="font-semibold flex justify-start hover:bg-red-100 px-2 py-1" onClick={() => setOpen(true)}>
          Delete
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Delete Product</DialogTitle>
          <DialogDescription className="text-left">Are you sure you want to delete this product?</DialogDescription>
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
