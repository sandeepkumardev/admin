import { IAttribute, IColor, ISize, IType } from "@/types";
import { create } from "zustand";

const attributes: IAttribute[] = [];
const sizes: ISize[] = [];
const colors: IColor[] = [];

interface IEnumsStore {
  // attributes: IAttribute[];
  // setAttributes: (attributes: IAttribute[]) => void;

  // sizes
  sizes: ISize[];
  setsizes: (value: ISize[]) => void;
  addSize: (type: string, value: string) => void;
  updateSize: (type: string, values: string[]) => void;

  // colors
  colors: IColor[];
  setColors: (value: IColor[]) => void;
  addColor: (value: IColor) => void;
  removeColor: (value: string) => void;

  // types
  types: IType[];
  setTypes: (value: IType[]) => void;
  addType: (id: string, value: string) => void;
  updateType: (id: string, value: string) => void;
  removeType: (value: string) => void;
  addAttributeKey: (attribute: IAttribute, id: string) => void;
  addAttributeValue: (id: string, value: string, typeId: string) => void;
  updateAttributeKey: (id: string, key: string, typeId: string) => void;
  removeAttributeKey: (id: string, typeId: string) => void;
  removeAttributeValue: (id: string, values: string[], typeId: string) => void;
}

export const useEnumsStore = create<IEnumsStore>((set) => ({
  // attributes: attributes,
  // setAttributes: (attributes: IAttribute[]) => set({ attributes }),

  // sizes
  sizes: sizes,
  setsizes: (sizes: ISize[]) => set({ sizes }),
  addSize: (type: string, value: string) =>
    set((state) => ({ sizes: state.sizes.map((s) => (s.type === type ? { ...s, value: [...s.value, value] } : s)) })),
  updateSize: (type: string, values: string[]) =>
    set((state) => ({ sizes: state.sizes.map((s) => (s.type === type ? { ...s, value: values } : s)) })),

  // colors
  colors: colors,
  setColors: (colors: IColor[]) => set({ colors }),
  addColor: (data: IColor) => set((state) => ({ colors: [...state.colors, data] })),
  removeColor: (name: string) => set((state) => ({ colors: state.colors.filter((s) => s.name !== name) })),

  // types
  types: [],
  setTypes: (value: IType[]) => set({ types: value }),
  addType: (id: string, value: string) => set((state) => ({ types: [...state.types, { id, name: value }] })),
  updateType: (id: string, value: string) =>
    set((state) => ({ types: state.types.map((s) => (s.id === id ? { ...s, name: value } : s)) })),
  removeType: (id: string) => set((state) => ({ types: state.types.filter((s) => s.id !== id) })),
  addAttributeKey: (attribute: IAttribute, id: string) =>
    set((state) => ({
      types: state.types.map((s) =>
        s.id === id ? { ...s, attributes: s.attributes ? [...s.attributes, attribute] : [attribute] } : s
      ),
    })),
  addAttributeValue: (id: string, value: string, typeId: string) =>
    set((state) => ({
      types: state.types.map((s) =>
        s.id === typeId
          ? { ...s, attributes: s.attributes?.map((a) => (a.id === id ? { ...a, value: [...a.value, value] } : a)) }
          : s
      ),
    })),
  updateAttributeKey: (id: string, key: string, typeId: string) =>
    set((state) => ({
      types: state.types.map((s) =>
        s.id === typeId ? { ...s, attributes: s.attributes?.map((a) => (a.id === id ? { ...a, key } : a)) } : s
      ),
    })),
  removeAttributeKey: (id: string, typeId: string) =>
    set((state) => ({
      types: state.types.map((s) => (s.id === typeId ? { ...s, attributes: s.attributes?.filter((a) => a.id !== id) } : s)),
    })),
  removeAttributeValue: (id: string, values: string[], typeId: string) =>
    set((state) => ({
      types: state.types.map((s) =>
        s.id === typeId
          ? {
              ...s,
              attributes: s.attributes?.map((a) => (a.id === id ? { ...a, value: values } : a)),
            }
          : s
      ),
    })),
}));
