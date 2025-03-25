import { fetcher, fetchOpt } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { useEffect } from "react";
import useSWR from "swr";

export const useSizes = () => {
  const { setsizes, sizes } = useEnumsStore();
  const { data, mutate, isLoading: fetchingSizes } = useSWR(sizes.length === 0 ? "/api/sizes" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !sizes.length) {
      setsizes(data.data || []);
    }
  }, [data, mutate, setsizes]);
  return { sizes, fetchingSizes };
};
