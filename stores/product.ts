import { IColor, IImageFile, IProduct } from "@/types";
import { create } from "zustand";

const files: IImageFile[] = [];
const colors: IColor[] = [];

interface IFiles {
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  colors: IColor[];
  setColors: (colors: IColor[]) => void;
  video: string;
  setVideo: (url: string) => void;
}

export const useFileStore = create<IFiles>((set) => ({
  files: files,
  setFiles: (files) => set({ files: files }),
  colors: colors,
  setColors: (colors) => set({ colors: colors }),
  video: "",
  setVideo: (url) => set({ video: url }),
}));

const products: IProduct[] = [];

interface IProductStore {
  products: IProduct[];
  setProducts: (products: IProduct[]) => void;
  addProduct: (product: IProduct) => void;
  updateProduct: (id: string, data: IProduct) => void;
  deleteProdct: (id: string) => void;
}

export const useProductStore = create<IProductStore>((set) => ({
  products: products,
  setProducts: (products: IProduct[]) => set({ products }),
  addProduct: (product: IProduct) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id: string, data: IProduct) => {
    set((state: IProductStore) => {
      const index = state.products.findIndex((product) => product.id === id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...data };
        return { products: state.products };
      }
      return { products: state.products };
    });
  },
  deleteProdct: (id: string) => set((state) => ({ products: state.products.filter((item) => item.id !== id) })),
}));
