import { ICategory } from "@/types";
import { create } from "zustand";

const categories: ICategory[] = [];

interface ICategoryStore {
  categories: ICategory[];
  setCategories: (categories: ICategory[]) => void;
  addCategory: (category: ICategory) => void;
  deleteCategory: (category: ICategory) => void;
  updateCategory: (category: ICategory) => void;
  updateCategoryName: (categoryId: string, name: string, slug: string, isParent: boolean) => void;
}

export const useCategoryStore = create<ICategoryStore>((set) => ({
  categories: categories,
  setCategories: (categories: ICategory[]) => set({ categories }),
  addCategory: (category: ICategory) => {
    set((state: ICategoryStore) => {
      if (category.parentId) {
        // Adding a subcategory
        const updatedCategories = state.categories.map((item: ICategory) => {
          if (item.id === category.parentId) {
            const updatedChildren = item.children ? [...item.children, category] : [category];
            return { ...item, children: updatedChildren };
          }
          return item;
        });
        return { categories: updatedCategories };
      } else {
        // Adding a parent category
        return { categories: [...state.categories, category] };
      }
    });
  },
  deleteCategory: (category: ICategory) => {
    set((state: ICategoryStore) => {
      if (category.parentId) {
        // Deleting a subcategory
        const updatedCategories = state.categories.map((item: ICategory) => {
          if (item.id === category.parentId) {
            const updatedChildren = item.children
              ? item.children.filter((child: ICategory) => child.id !== category.id)
              : [];
            return { ...item, children: updatedChildren };
          }
          return item;
        });
        return { categories: updatedCategories };
      } else {
        // Deleting a parent category
        const updatedCategories = state.categories.filter((item: ICategory) => item.id !== category.id);
        return { categories: updatedCategories };
      }
    });
  },
  updateCategory: (category: ICategory) => {
    set((state: ICategoryStore) => {
      if (category.parentId) {
        // Updating a subcategory
        const updatedCategories = state.categories.map((item: ICategory) => {
          if (item.id === category.parentId) {
            const updatedChildren = item.children
              ? item.children.map((child: ICategory) => {
                  if (child.id === category.id) {
                    return category;
                  }
                  return child;
                })
              : [];
            return { ...item, children: updatedChildren };
          }
          return item;
        });
        return { categories: updatedCategories };
      } else {
        // Updating a parent category
        const updatedCategories = state.categories.map((item: ICategory) => {
          if (item.id === category.id) {
            return category;
          }
          return item;
        });
        return { categories: updatedCategories };
      }
    });
  },
  updateCategoryName: (categoryId: string, name: string, slug: string, isParent: boolean) => {
    set((state: ICategoryStore) => {
      const updatedCategories = state.categories.map((item: ICategory) => {
        if (!isParent) {
          const updatedChildren = item.children?.map((child: ICategory) => {
            if (child.id === categoryId) {
              return { ...child, name, slug };
            }
            return child;
          });
          return { ...item, children: updatedChildren };
        }
        if (item.id === categoryId) {
          return { ...item, name, slug };
        }
        return item;
      });
      return { categories: updatedCategories };
    });
  },
}));
