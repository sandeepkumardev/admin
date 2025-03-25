"use server";

import { prisma } from "../prisma";

export const createAttribute = async (key: string, productTypeId: string) => {
  try {
    const attribute = await prisma.attribute.create({
      data: { key, value: [], productTypeId },
    });

    return { ok: true, data: attribute };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Attribute already exists" };
    }

    console.log(error);
    return { ok: false, error: error.message };
  }
};

export const addAttributeValueDB = async (id: string, value: string) => {
  try {
    await prisma.attribute.update({
      where: { id },
      data: {
        value: { push: value },
      },
    });

    return { ok: true };
  } catch (error: any) {
    console.log(error);
    return { ok: false, error: error.message };
  }
};

export const deleteAttributeDB = async (id: string) => {
  try {
    await prisma.attribute.delete({ where: { id } });
    return { ok: true };
  } catch (error: any) {
    console.log(error);
    return { ok: false, error: error.message };
  }
};

export const deleteAttributeValueDB = async (id: string, values: string[]) => {
  try {
    await prisma.attribute.update({
      where: { id },
      data: {
        value: { set: values },
      },
    });
    return { ok: true };
  } catch (error: any) {
    console.log(error);
    return { ok: false, error: error.message };
  }
};

export const updateAttributeDB = async (id: string, key: string) => {
  try {
    await prisma.attribute.update({
      where: { id },
      data: { key },
    });
    return { ok: true };
  } catch (error: any) {
    console.log(error);
    return { ok: false, error: error.message };
  }
};
