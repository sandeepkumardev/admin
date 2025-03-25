"use server";

import { prisma } from "../prisma";

export const createProductTypeDB = async (name: string) => {
  try {
    const data = await prisma.productTypes.create({
      data: { name },
    });

    return { ok: true, data };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Product type already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const updateProductTypeDB = async (id: string, name: string) => {
  try {
    await prisma.productTypes.update({
      where: { id },
      data: { name },
    });

    return { ok: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Product type already exists" };
    }
    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const deleteProductTypeDB = async (id: string) => {
  try {
    await prisma.productTypes.delete({
      where: { id },
    });

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};
