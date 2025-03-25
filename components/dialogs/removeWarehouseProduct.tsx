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
import { removeWarehouseProduct } from "@/lib/actions/warehouse.action";

export function RemoveWarehouseProduct({ id, warehouseId }: { id: string; warehouseId: string }) {
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    const res = await removeWarehouseProduct(id);
    setIsDeleting(false);
    if (!res.ok) return console.log(res.error);
    setOpen(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-red-500 w-full">
        <div className="flex justify-start hover:bg-red-100 px-2 py-1" onClick={() => setOpen(true)}>
          Remove
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-left">Remove Product</DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to remove this product from this warehosue?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="destructive" onClick={handleRemove}>
            {isRemoving ? "removeing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
