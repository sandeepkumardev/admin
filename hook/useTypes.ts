import { fetcher, fetchOpt } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { useEffect } from "react";
import useSWR from "swr";

export const useTypes = () => {
  const { types, setTypes } = useEnumsStore();
  const {
    data,
    mutate,
    isLoading: fetchingTypes,
  } = useSWR(types.length === 0 ? "/api/productTypes" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !types.length) {
      setTypes(data.data || []);
    }
  }, [data, mutate, setTypes]);
  return { types, fetchingTypes };
};
