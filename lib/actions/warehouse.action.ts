"use server";

import { prisma } from "../prisma";

export const addWareHouse = async (data: any) => {
  try {
    const warehouse = await prisma.wareHouse.create({
      data,
    });
    return { ok: true, data: warehouse };
  } catch (err: any) {
    console.log(err);
    if (err.code === "P2002") {
      return { ok: false, error: "Warehouse already exists" };
    }
    return { ok: false, error: "Something went wrong" };
  }
};

export const updateWareHouse = async (id: string, data: any) => {
  try {
    console.log(id, data);
    const warehouse = await prisma.wareHouse.update({ where: { id }, data });
    return { ok: true, data: warehouse };
  } catch (err: any) {
    console.log(err);
    return { ok: false, error: "Something went wrong" };
  }
};

export const deleteWareHouse = async (id: string) => {
  try {
    const warehouse = await prisma.wareHouse.delete({ where: { id } });
    return { ok: true, data: warehouse };
  } catch (err: any) {
    console.log(err);
    return { ok: false, error: "Something went wrong" };
  }
};

export const addWarehouseProduct = async (productId: string, quantity: number, warehouseId: string, name: string) => {
  try {
    const warehouse = await prisma.wareHouseProducts.create({ data: { productId, warehouseId } });
    return { ok: true, data: warehouse };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { ok: false, error: "Product already exists in warehouse" };
    }
    console.log(err);
    return { ok: false, error: "Something went wrong" };
  }
};

export const removeWarehouseProduct = async (id: string) => {
  try {
    const warehouse = await prisma.wareHouseProducts.delete({ where: { id } });
    return { ok: true, data: warehouse };
  } catch (err: any) {
    console.log(err);
    return { ok: false, error: "Something went wrong" };
  }
};
