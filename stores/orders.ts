import { create } from "zustand";

interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  billingId: string;
  shippingId: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const orders: IOrder[] = [];

interface IOrderStore {
  orders: IOrder[];
  setOrders: (orders: IOrder[]) => void;
  updateOrderStatus: (orderId: string, status: string, updatedAt: string) => void;
}

export const useOrderStore = create<IOrderStore>((set) => ({
  orders: orders,
  setOrders: (orders) => set({ orders: orders }),
  updateOrderStatus: async (orderId: string, status: string, updatedAt: string) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: status, updatedAt: updatedAt };
        }
        return order;
      }),
    }));
  },
}));
