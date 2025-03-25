import { fetcher, fetchOpt } from "@/lib/utils";
import { useCollectionStore } from "@/stores/collections";
import { set } from "lodash";
import { useEffect } from "react";
import useSWR from "swr";

export const useCollections = () => {
  const { collections, setCollections } = useCollectionStore();
  const {
    data,
    mutate,
    isLoading: fetchingCollections,
  } = useSWR(collections.length === 0 ? "/api/collections" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !collections.length) {
      setCollections(data.data || []);
    }
  }, [data, mutate, setCollections]);
  return { collections, fetchingCollections };
};
