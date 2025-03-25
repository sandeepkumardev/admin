import { IProduct, IWarehouse } from "@/types";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LuChevronDown } from "react-icons/lu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ICategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useProductStore } from "@/stores/product";
import useSWR from "swr";
import { error, fetcher, fetchOpt } from "@/lib/utils";
import { DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, X } from "lucide-react";
import { addWarehouseProduct } from "@/lib/actions/warehouse.action";

const ProductTable = ({ data, refetch }: { data: IWarehouse; refetch: () => void }) => {
  return (
    <>
      <DataTable isLoading={false} columns={columns} data={data.products} warehouse={data} refetch={refetch} />
    </>
  );
};

interface DataTableProps<TData, TValue> {
  isLoading: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  warehouse: IWarehouse;
  refetch: () => void;
}

function DataTable<TData, TValue>({ isLoading, columns, data, warehouse, refetch }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [open, setOpen] = React.useState(false);

  const { products, setProducts } = useProductStore();
  const { mutate: fetchProducts, isLoading: fetchProductsLoading } = useSWR("/api/products?table-data", fetcher, fetchOpt);
  const [addQuantity, setAddQuantity] = React.useState<{ productId: string; quantity?: number | null }>({
    productId: "",
    quantity: null,
  });

  const handleAddNew = async () => {
    setOpen(true);
    if (!products.length) {
      const res = await fetchProducts();
      setProducts(res?.data || []);
    }
  };

  // @ts-ignore
  const productIds = new Set(data.map((item) => item.productId));
  const filteredProducts = React.useMemo(() => products.filter((product) => !productIds.has(product.id)), [products, data]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleAddProduct = async () => {
    if (addQuantity.quantity && addQuantity.productId) {
      const res = await addWarehouseProduct(addQuantity.productId, addQuantity.quantity, warehouse.id, warehouse.name);
      if (!res.ok) {
        error(res.error || "Failed to add product");
        return;
      }
      setAddQuantity({ productId: "", quantity: null });
      setOpen(false);
      refetch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end py-2">
        <Button onClick={handleAddNew} className="rounded" size={"sm"}>
          Add Product
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle></DialogTitle>
          <CommandInput placeholder="Type a name or search..." />
          <CommandList>
            {fetchProductsLoading ? <p>Loading...</p> : <CommandEmpty>No results found.</CommandEmpty>}
            <CommandGroup>
              {filteredProducts?.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <CommandItem
                    onSelect={() => {
                      setAddQuantity({
                        productId: product.id as string,
                      });
                    }}
                    className="text-sm cursor-pointer leading-3 w-full font-light flex justify-between items-center"
                  >
                    <div>{product.name}</div>
                  </CommandItem>
                  {addQuantity.productId === product.id && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={addQuantity.quantity || ""}
                        onChange={(e) => {
                          setAddQuantity({
                            ...addQuantity,
                            quantity: parseInt(e.target.value),
                          });
                        }}
                        placeholder="Qut."
                        className="w-20"
                      />
                      <CheckCircle className="h-5 w-5 ml-1 cursor-pointer text-green-600" onClick={handleAddProduct} />
                      <X
                        className="h-6 w-6 ml-1 cursor-pointer text-red-600"
                        onClick={() => setAddQuantity({ productId: "", quantity: 0 })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex flex-col gap-5 h-full w-full items-center justify-center">
                    <Skeleton className="w-full h-[20px] rounded-full" />
                    <Skeleton className="w-full h-[20px] rounded-full" />
                    <Skeleton className="w-full h-[20px] rounded-full" />
                    <Skeleton className="w-full h-[20px] rounded-full" />
                    <Skeleton className="w-full h-[20px] rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} results</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductTable;
