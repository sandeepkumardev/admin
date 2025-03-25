import { IProductAttribute, IProductSize } from "@/types";
import { create } from "zustand";

interface IFormData {
  name: string;
  description: string;
  price: string;
  mrp: string;
  material: string;
  weight: string;
  hasDeliveryFee: boolean;
  inStock: boolean;
  isNewArrival: boolean;
  genders: string[];
  sizeCategory: string;
  sizes: IProductSize[];
  warehouses: { id: string; quantity: number; name: string }[];
  productType: string;
  category: string;
  subCategory: string;
  attributes: IProductAttribute[];
}

interface IAddProductState {
  formData: IFormData;
  setFormData: (data: Partial<IFormData>) => void; // Partial allows partial updates
}

const formData = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  material: "",
  weight: "",
  hasDeliveryFee: false,
  inStock: false,
  isNewArrival: false,
  genders: [],
  sizeCategory: "",
  sizes: [],
  warehouses: [],
  productType: "",
  category: "",
  subCategory: "",
  attributes: [],
};

export const addProductState = create<IAddProductState>((set) => ({
  formData: formData,
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
}));
