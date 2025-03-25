import { fetcher, fetchOpt } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { useEffect } from "react";
import useSWR from "swr";

export const useColors = () => {
  const { colors, setColors } = useEnumsStore();
  const { data, mutate, isLoading: fetchingColors } = useSWR(colors.length === 0 ? "/api/colors" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !colors.length) {
      setColors(data.data || []);
    }
  }, [data, mutate, setColors]);
  return { colors, fetchingColors };
};
