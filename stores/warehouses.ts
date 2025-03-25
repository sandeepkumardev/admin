import { IWarehouse } from "@/types";
import { create } from "zustand";

const warehouses: IWarehouse[] = [];

interface IWarehouseStore {
  warehouses: IWarehouse[];
  setWarehouses: (warehouses: IWarehouse[]) => void;
}

export const useWarehouseStore = create<IWarehouseStore>((set) => ({
  warehouses: warehouses,
  setWarehouses: (warehouses: IWarehouse[]) => set({ warehouses }),
}));
