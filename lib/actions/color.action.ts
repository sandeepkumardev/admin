"use server";

import { prisma } from "../prisma";

export const createColorDB = async (name: string, hex: string) => {
  try {
    const color = await prisma.color.create({
      data: { name, hex },
    });

    return { ok: true, data: color };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "color already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const deleteColorDB = async (name: string) => {
  try {
    await prisma.color.delete({
      where: { name },
    });

    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};
