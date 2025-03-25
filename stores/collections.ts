import { ICollection } from "@/types";
import { create } from "zustand";

const collections: ICollection[] = [];

interface ICollectionStore {
  collections: ICollection[];
  setCollections: (groupCategory: ICollection[]) => void;
  addCollection: (groupCategory: ICollection) => void;
  // updateCollection: (id: string, data: any) => void;
  deleteCollection: (id: string) => void;
}

export const useCollectionStore = create<ICollectionStore>((set) => ({
  collections: collections,
  setCollections: (data: ICollection[]) => set({ collections: data }),
  addCollection: (data: ICollection) => {
    set((state) => {
      state.collections.push(data);
      return { collections: state.collections };
    });
  },
  // updateCollection: (id: string, data: any) => {
  //   set((state) => {
  //     const index = state.collections.findIndex((item) => item.id === id);
  //     if (index !== -1) {
  //       state.collections[index] = { ...state.collections[index], ...data };
  //       return { collections: state.collections };
  //     }
  //     return { collections: state.collections };
  //   });
  // },
  deleteCollection: (id: string) => {
    set((state) => {
      state.collections = state.collections.filter((item) => item.id !== id);
      return { collections: state.collections };
    });
  },
}));
