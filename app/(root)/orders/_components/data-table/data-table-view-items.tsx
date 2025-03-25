"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EyeIcon } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

interface DataTableViewItemsProps<TData> {
  row: Row<TData>;
}

export function DataTableViewItems<TData>({ row }: DataTableViewItemsProps<any>) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-[100px] flex items-center">
            <EyeIcon className="mr-2 h-4 w-4 text-muted-foreground cursor-pointer" />
            {/** @ts-ignore */}
            <span>{row.getValue("items")?.length}</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Items</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/** @ts-ignore */}
          {row.getValue("items")?.map((item, i) => (
            <DropdownMenuItem key={i} className="cursor-pointer">
              <span className="mr-2">{item.quantity}x</span> <span className="line-clamp-2">{item.product.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
