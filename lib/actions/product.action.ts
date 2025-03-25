"use server";

import { IProduct } from "@/types";
import { prisma } from "../prisma";

export const createProduct = async (product: IProduct) => {
  try {
    // const category = await prisma.category.findUnique({ where: { id: product.categoryId } });
    // if (!category) {
    //   return { ok: false, error: "Category not found" };
    // }

    const res = await prisma.$transaction(async (prisma) => {
      const data = await prisma.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          material: product.material,
          productTypeId: product.productType,
          sizeCategory: product.sizeCategory,
          genders: product.genders,
          categoryId: product.categoryId,
          video: product.video,
          isNewArrival: true,
        },
      });

      // create product attributes
      await prisma.productAttributes.createMany({
        data: product.attributes.map((attribute) => ({
          key: attribute.key,
          value: attribute.value,
          productId: data.id,
        })),
      });

      // add product to warehouseproducts
      await prisma.wareHouseProducts.createMany({
        data: product.warehouses.map((warehouse) => ({
          productId: data.id,
          warehouseId: warehouse.id,
        })),
      });

      // create product colors
      await prisma.productColors.createMany({
        data: product.colors.map((color) => ({
          name: color.name,
          hex: color.hex,
          productId: data.id,
        })),
      });

      // create product sizes
      await prisma.productSizes.createMany({
        data: product.sizes.map((size) => ({
          key: size.key,
          value: size.value,
          quantity: size.quantity,
          productColor: size.productColor,
          productId: data.id,
        })),
      });

      // create product images
      await prisma.productImages.createMany({
        data: product.images.map((image) => ({
          key: image.key,
          url: image.url,
          color: image.color,
          publicId: image.publicId,

          productId: data.id,
        })),
      });

      // // create product attributes
      // await prisma.productAttributes.createMany({
      //   data: product.attributes.map((attribute) => ({
      //     key: attribute.key,
      //     value: attribute.value,
      //     productId: data.id,
      //   })),
      // });

      return data;
    });

    return { ok: true, productId: res.id };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Product already exists" };
    }

    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};

export const updateProductDB = async (id: string, data: IProduct) => {
  try {
    // const product = await prisma.product.findUnique({ where: { id: id } });
    // if (!product) {
    //   return { ok: false, error: "Product not found" };
    // }

    // // Fetch related categories
    // const subCategory = await prisma.category.findUnique({ where: { id: data.categoryId } });
    // if (!subCategory) {
    //   return { ok: false, error: "Sub category not found" };
    // }

    await prisma.$transaction(async (prisma) => {
      await prisma.product.update({
        where: { id: id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          mrp: data.mrp,
          material: data.material,
          productTypeId: data.productType,
          sizeCategory: data.sizeCategory,
          inStock: data.inStock,
          isNewArrival: data.isNewArrival,
          genders: data.genders,
          isBestSeller: false,
          categoryId: data.categoryId,
        },
      });

      // update warehouses
      await prisma.wareHouseProducts.deleteMany({ where: { productId: id } });
      await prisma.wareHouseProducts.createMany({
        data: data.warehouses.map((warehouse) => ({
          productId: id,
          warehouseId: warehouse.id,
        })),
      });

      // update product colors
      await prisma.productColors.deleteMany({ where: { productId: id } });
      await prisma.productColors.createMany({
        data: data.colors.map((color) => ({
          name: color.name,
          hex: color.hex,
          productId: id,
        })),
      });

      // update product sizes
      await prisma.productSizes.deleteMany({ where: { productId: id } });
      await prisma.productSizes.createMany({
        data: data.sizes.map((size) => ({
          key: size.key,
          value: size.value,
          quantity: size.quantity,
          productColor: size.productColor,
          productId: id,
        })),
      });

      // update product images
      await prisma.productImages.deleteMany({ where: { productId: id } });
      await prisma.productImages.createMany({
        data: data.images.map((image) => ({
          key: image.key,
          url: image.url,
          color: image.color,
          publicId: image.publicId,

          productId: id,
        })),
      });

      // // update product attributes
      // await prisma.productAttributes.deleteMany({ where: { productId: id } });
      // await prisma.productAttributes.createMany({
      //   data: data.attributes.map((attribute) => ({
      //     key: attribute.key,
      //     value: attribute.value,
      //     productId: id,
      //   })),
      // });
    });

    return { ok: true };
  } catch (error: any) {
    console.log(error.message);
    if (error.code === "P2002") {
      return { ok: false, error: "Product already exists" };
    }

    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};

export const deleteProductDB = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: id }, include: { images: true } });
    if (!product) {
      return { ok: false, error: "Product not found" };
    }

    await prisma.collectionProducts.deleteMany({
      where: { productId: id },
    });

    const imagesPublicIds = product.images.map((image) => image.publicId); // to delete images from cloudinary

    await prisma.product.delete({ where: { id: id } });
    return { ok: true, imagesPublicIds: imagesPublicIds.join() };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};
