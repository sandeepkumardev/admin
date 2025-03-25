import { fetcher, fetchOpt } from "@/lib/utils";
import { useWarehouseStore } from "@/stores/warehouses";
import { useEffect } from "react";
import useSWR from "swr";

export const useWarehouses = () => {
  const { warehouses, setWarehouses } = useWarehouseStore();
  const {
    data,
    mutate,
    isLoading: fetchWarehouseLoading,
  } = useSWR(warehouses.length === 0 ? "/api/warehouse" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.ok && data?.data) {
      setWarehouses(data.data || []);
    }
  }, [data, mutate, setWarehouses]);
  return { warehouses, fetchWarehouseLoading };
};
