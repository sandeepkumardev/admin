"use client";

import _ from "lodash";
import { Plus, Warehouse } from "lucide-react";
import Link from "next/link";

const WarehousesPage = ({ data }: { data: any[] }) => {
  return (
    <div className="flex gap-2">
      <Link href="/warehouses/create">
        <div className="flex items-center gap-2  w-40 cursor-pointer border rounded p-2 text-sm">
          <Plus className="h-6 w-6" />
          <p>Add Warehouse</p>
        </div>
      </Link>

      {_.map(data, (warehouse) => (
        <Link
          className="border rounded p-2 w-40 max-h-24 cursor-pointer overflow-hidden"
          href={`/warehouses/${warehouse.id}`}
          key={warehouse.id}
        >
          <div className="flex gap-2 items-center">
            <Warehouse className="h-6 w-6" />
            <p className="text-sm">{warehouse.warehouseName}</p>
          </div>
          <p className="mt-4 text-sm">{warehouse.contactPersonName}</p>
        </Link>
      ))}
    </div>
  );
};

export default WarehousesPage;
