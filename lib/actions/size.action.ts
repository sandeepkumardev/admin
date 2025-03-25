"use server";

import { prisma } from "../prisma";

export const createSizeDB = async (category: string, value: string) => {
  try {
    const size = await prisma.size.upsert({
      where: { type: category },
      update: { value: { push: value } },
      create: { type: category, value: [value] },
    });

    return { ok: true, data: size };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Size already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const deleteSizeDB = async (category: string, values: string[]) => {
  try {
    await prisma.size.update({
      where: { type: category },
      data: { value: values },
    });

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};
