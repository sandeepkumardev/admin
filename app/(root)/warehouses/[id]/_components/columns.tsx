"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICategory, IProduct } from "@/types";
import Link from "next/link";
import { DeleteProduct } from "@/components/dialogs/deleteProduct";
import { RemoveWarehouseProduct } from "@/components/dialogs/removeWarehouseProduct";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-2 tablet:ml-4">
        <Link href={`/p/${row.original.product.slug}`}>{row.original.product.name}</Link>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <div className="flex justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantity <LuArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.original.quantity}</div>;
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return <div className="flex justify-end">Actions</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/e/${row.original.product.slug}?path=/warehouses/${row.original.warehouseId}`}>
                <DropdownMenuItem className="hover:cursor-pointer">Edit</DropdownMenuItem>
              </Link>
              <Link href={`/p/${row.original.product.slug}`}>
                <DropdownMenuItem className="hover:cursor-pointer">View product details</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => {}} disabled className="hover:cursor-pointer">
                Mark as <code className="text-red-600 ml-2">outofstock</code>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <RemoveWarehouseProduct id={row.original.id || ""} warehouseId={row.original.warehouseId} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
