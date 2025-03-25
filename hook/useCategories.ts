import { fetcher, fetchOpt } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category";
import { useEffect } from "react";
import useSWR from "swr";

export const useCategories = () => {
  const { categories, setCategories } = useCategoryStore();
  const {
    data,
    mutate,
    isLoading: fetchCategoriesLoading,
  } = useSWR(categories.length === 0 ? "/api/categories" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !categories.length) {
      setCategories(data.data || []);
    }
  }, [data, mutate, setCategories]);
  return { categories, fetchCategoriesLoading };
};
