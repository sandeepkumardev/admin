export interface IAddress {
  name: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  residenceType?: string;
}

export interface ICourier {
  platform: string;
  courier_id: string;
  courier_name: string;
  courier_charge: number;
  is_surface: boolean;
  zone: string;
  deliveryTime: string;
  deliveryDate: string;
}

export interface IAttribute {
  id: string;
  key: string;
  value: string[];
  productTypeId?: string;
}

export interface ISize {
  id: string;
  type: string;
  value: string[];
}

export interface IColor {
  id: string;
  name: string;
  hex: string;
}

export interface IType {
  id: string;
  name: string;
  attributes?: IAttribute[];
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  wearType?: string;
  parentId?: string | null;
  children?: ICategory[];
  products?: IProduct[];
  parent?: ICategory;
}

export interface IWarehouse {
  id: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonMobile: number;
  warehouseName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  products: IProduct[];
}

export interface ICollection {
  id: string;
  name: string;
  slug: string;
  isGallery: boolean;
  icon: string;
  image: string;
  banner: string;
  isActive: boolean;
  products: IProduct[];
}

export interface IProduct {
  id?: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  material: string;
  inStock?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  colors: IColor[];
  genders: string[];
  warehouses: {
    id: string;
    name: string;
  }[];
  productType: string;
  sizeCategory: string;
  sizes: IProductSize[];
  images: IImageFile[];
  video: string;
  attributes: IProductAttribute[];

  category?: ICategory;
  categoryId: string;
  subCategory?: { id: string; name: string; slug?: string } | string;
}

export interface IImageFile {
  id?: string;
  key: string;
  color: string;
  blob?: string;
  url: string;
  publicId: string;
  productId?: string;
}

export interface IProductSize {
  index: number;
  id?: string;
  key: string;
  value: string;
  quantity: number;
  productColor: string;
  productId?: string;
}

export interface IProductAttribute {
  id?: string;
  key: string;
  value: string;
  productId?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  shippingId: string;
  shippingAddress: IAddress;
  items: IOrderItem[];
  status: string;
  totalAmount: number;
  deliveryCharge: number;
  giftWrapCharge: number;
  subTotal: number;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  shipment: any;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: IProduct;
  color: string;
  size: string;
  quantity: number;
  price: number;
  totalPrice: number;
}
