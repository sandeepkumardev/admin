"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { status_options } from "@/constants";
import { updateOrderStatusDB } from "@/lib/actions/order.action";
import { useOrderStore } from "@/stores/orders";
import { formatDate } from "@/lib/date";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<any>) {
  const router = useRouter();
  const { updateOrderStatus } = useOrderStore();
  // const [dialogContent, setDialogContent] = React.useState<React.ReactNode | null>(null);
  const [showCancelDialog, setShowCancelDialog] = React.useState<boolean>(false);
  const order = row.original;

  // const handleEditClick = () => {
  //   setDialogContent(<EditDialog task={task} />);
  // };

  const hadleChangeStatus = async (status: string) => {
    const res = await updateOrderStatusDB(order.id, status);
    if (res) {
      updateOrderStatus(order.id, status, formatDate(res.updatedAt));
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.orderNumber)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Copy Order Number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={() => router.push(`/orders/${order.orderNumber}`)}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onSelect={() => setShowCancelDialog(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Order
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={order.status}>
                {status_options.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    onClick={() => hadleChangeStatus(status.value)}
                  >
                    <status.icon className="w-4 h-4 mr-2" style={{ color: status.color }} />
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <CancelDialog
        task={task}
        isOpen={showCancelDialog}
        showActionToggle={setShowCancelDialog}
      /> */}
    </Dialog>
  );
}
