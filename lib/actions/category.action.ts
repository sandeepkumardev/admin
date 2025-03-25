"use server";

import { prisma } from "../prisma";

export const createCategoryDB = async (name: string, slug: string) => {
  try {
    const category = await prisma.category.create({ data: { name, slug, parentId: null } });
    return { ok: true, data: category };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Category already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const updateCategoryNameDB = async (id: string, name: string, slug: string) => {
  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
    return { ok: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Category already exists" };
    }
    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};

export const createSubCategoryDB = async (categoryId: string, name: string, slug: string, wearType: string) => {
  try {
    const rootCategory = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!rootCategory) {
      return { ok: false, error: "Category not found" };
    }

    const category = await prisma.category.create({
      data: { name, slug, wearType, parentId: rootCategory.id },
    });

    return { ok: true, data: category };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Category already exists" };
    }

    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};

export const deleteCategoryDB = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id: id }, include: { children: true, products: true } });
  if (!category) {
    return { ok: false, error: "Category not found" };
  }

  // delete all the subcategories
  for (const subCategory of category.children) {
    await prisma.category.delete({ where: { id: subCategory.id } });
  }

  const res = await prisma.category.delete({ where: { id: category.id } });
  return { ok: true, data: res };
};
