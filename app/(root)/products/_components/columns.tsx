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
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<IProduct>[] = [
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
        <Link href={`/p/${row.original.slug}`}>{row.getValue("name")}</Link>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const data: ICategory = row.getValue("category");
      return <div className="capitalize">{data?.parent?.name}</div>;
    },
  },
  {
    accessorKey: "subCategory",
    header: "Sub Category",
    cell: ({ row }) => {
      const data: { name: string } = row.getValue("category");
      return <div className="capitalize">{data?.name}</div>;
    },
  },
  {
    accessorKey: "sizes",
    header: "Quantity",
    cell: ({ row }) => {
      const data: { quantity: number }[] = row.getValue("sizes");
      const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);
      return <div className="capitalize">{totalQuantity || 0}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount <LuArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      // Format the price as a dollar price
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "mrp",
    header: () => <div className="text-right">MRP</div>,
    cell: ({ row }) => {
      const mrp = parseFloat(row.getValue("mrp"));
      // Format the mrp as a dollar mrp
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(mrp);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/e/${row.original.slug}?path=/products`}>
              <DropdownMenuItem className="hover:cursor-pointer">Edit</DropdownMenuItem>
            </Link>
            <Link href={`/p/${row.original.slug}`}>
              <DropdownMenuItem className="hover:cursor-pointer">View product details</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => {}} disabled className="hover:cursor-pointer">
              Mark as <code className="text-red-600 ml-2">outofstock</code>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteProduct id={row.original.id || ""} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
