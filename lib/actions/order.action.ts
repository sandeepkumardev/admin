"use server";

import { prisma } from "../prisma";

export const updateOrderStatusDB = async (orderId: string, status: string) => {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });
  return order;
};
