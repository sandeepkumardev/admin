"use server";

import { prisma } from "../prisma";

export const isCollectionExist = async (slug: string) => {
  try {
    const res = await prisma.collection.findUnique({ where: { slug } });
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createCollectionDB = async (
  name: string,
  slug: string,
  isGallery: boolean,
  icon: string,
  image: string,
  banner: string
) => {
  try {
    const gCategory = await prisma.collection.create({ data: { name, slug, isGallery, icon, image, banner } });
    return { ok: true, data: gCategory };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Collection already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const updateCollectionDB = async ({
  id,
  data: { name, slug, isActive, icon, image, banner },
}: {
  id: string;
  data: {
    name?: string;
    slug?: string;
    isActive?: boolean;
    icon?: string;
    image?: string;
    banner?: string;
  };
}) => {
  try {
    await prisma.collection.update({
      where: { id },
      data: { name, slug, isActive, icon, image, banner },
    });

    return { ok: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Collection already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const updateCollectionProductsDB = async ({
  collectionId,
  products,
}: {
  collectionId: string;
  products: string[];
}) => {
  try {
    await prisma.$transaction([
      prisma.collectionProducts.deleteMany({ where: { collectionId } }),
      prisma.collectionProducts.createMany({ data: products.map((id) => ({ collectionId, productId: id })) }),
    ]);
    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const deleteCollectionDB = async (id: string) => {
  try {
    await prisma.$transaction([
      prisma.collectionProducts.deleteMany({ where: { collectionId: id } }),
      prisma.collection.delete({ where: { id } }),
    ]);
    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};
