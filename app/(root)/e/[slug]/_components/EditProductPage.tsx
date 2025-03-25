"use client";

import * as z from "zod";
import useSWR from "swr";
import { fetcher, fetchOpt } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { productValidation } from "@/lib/validations/product";
import { useEffect, useState } from "react";
import { ICategory, IColor, IImageFile, IProduct, IProductAttribute, IProductSize } from "@/types";
import { updateProductDB } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import SizeDetails from "@/components/forms/SizeDetails";
import AttributesInput from "@/components/forms/AttributesInput";
import InputField from "@/components/forms/InputField";
import SelectFields from "@/components/forms/SelectField";
import SwitchField from "@/components/forms/SwitchField";
import ImageContainer from "@/components/forms/ImageContainer";
import { useProductStore } from "@/stores/product";
import { error, success } from "@/lib/utils";
import GenderInput from "@/components/forms/GenderInput";
import { capitalize } from "lodash";
import SizeCategory from "@/components/forms/SizeCategory";
import { sizeCategories } from "@/constants";
import SelectProductType from "@/components/forms/SelectProductType";
import { useSizes } from "@/hook/useSizes";
import { useColors } from "@/hook/useColors";
import { useAttributes } from "@/hook/useAttributes";
import { useTypes } from "@/hook/useTypes";
import WarehouseInput from "@/components/forms/WarehouseInput";
import { useWarehouses } from "@/hook/useWarehouses";

const EditProductPage = ({ product, searchParams }: { product: IProduct; searchParams: any }) => {
  const { mutate: fetchCategories } = useSWR("/api/categories", fetcher, fetchOpt);
  const { categories, setCategories } = useCategoryStore();

  const { updateProduct } = useProductStore();
  const router = useRouter();
  const { sizes: defaultSizes } = useSizes();
  const { colors: defaultColors } = useColors();
  const { attributes: defaultAttributes } = { attributes: [] };
  const { types: defaultTypes } = useTypes();
  const { warehouses: defaultWarehouses, fetchWarehouseLoading } = useWarehouses();
  const [subCategory, setSubCategory] = useState(product.categoryId);
  const [category, setCategory] = useState(product.category?.parent?.id || "");
  const [productType, setProductType] = useState(product.productType);
  const [sizeCategory, setSizeCatgory] = useState<string>(product.sizeCategory);
  const [genders, setGenders] = useState<string[]>(product.genders);
  const [sizes, setSizes] = useState<IProductSize[]>(product.sizes);
  const [files, setFiles] = useState<IImageFile[]>(product.images);
  const [colors, setColors] = useState<IColor[]>(product.colors);
  const [attributes, setAttributes] = useState<IProductAttribute[]>(product.attributes);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  console.log(defaultTypes);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      mrp: product.mrp.toString(),
      material: product.material,
      inStock: product.inStock,
      isNewArrival: product.isNewArrival,
    },
  });

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    const res = validateData();
    // @ts-ignore
    if (!res?.ok) return;

    setLoading(true);
    const data: IProduct = {
      name: capitalize(values.name.trim()),
      sku: product.sku,
      slug: values.name.trim().replace(/\s+/g, "-").toLowerCase(),
      description: values.description,
      price: Number(values.price),
      mrp: Number(values.mrp),
      material: capitalize(values.material),
      productType: productType,
      sizeCategory: sizeCategory,
      inStock: values.inStock,
      isNewArrival: values.isNewArrival,
      genders,
      colors,
      sizes,
      attributes,
      images: files,
      categoryId: subCategory,
      warehouses: warehouses,
    };

    const response = await updateProductDB(product.id || "", data);
    if (!response?.ok) {
      error(response?.error || "Something went wrong");
      setLoading(false);
      return;
    }

    success("Product updated successfully");
    setLoading(false);
    updateProduct(product.id || "", data);
    setProductType("");
    setWarehouses([]);
    router.replace(searchParams.path);
  };

  const validateData = () => {
    if (!files.length) return error("Please add some images");
    if (colors.length * 5 !== files.length) return error("Please add all the images");
    if (!warehouses.length) return error("Please add a warehouse");
    if (!category) return error("Please select the product category");
    if (!subCategory) return error("Please select the product sub category");
    if (!sizes.length) return error("Please select the product sizes");
    for (const item of sizes) {
      if (!item.key || !item.quantity) return error("Please fill all fields in size.");
    }
    if (!attributes.length) return error("Please add some attributes");
    return { ok: true };
  };

  useEffect(() => {
    if (category) {
      setSubCategories(categories.find((item) => item.id === category)?.children || []);
    }
  }, [category]);

  useEffect(() => {
    // setSubCategory(product.categoryId);
    // setCategory(product.category?.parent?.id || "");
    // setProductType(product.productType);
    // setSizeCatgory(product.sizeCategory);
    // setGenders(product.genders);
    // setSizes(product.sizes);
    // setFiles(product.images);
    // setColors(product.colors);
    // setAttributes(product.attributes);
    // @ts-ignore
    setWarehouses([...product.warehouses.map((k) => ({ id: k.warehouseId, name: k.name }))]);
  }, [product]);

  useEffect(() => {
    const fetch = async () => {
      if (!categories.length) {
        const res = await fetchCategories();
        setCategories(res?.data || []);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <ImageContainer
        files={files}
        setFiles={setFiles}
        colors={colors}
        setColors={setColors}
        defaultColors={defaultColors}
      />

      <Form {...form}>
        <form className="flex flex-col justify-start gap-3 p-2" onSubmit={form.handleSubmit(onSubmit)}>
          <InputField control={form.control} name="name" label="Product Name" placeholder="Product Name" />
          <InputField
            control={form.control}
            name="description"
            label="Product Description"
            placeholder="Product Description"
            textarea
          />
          <div className="flex gap-3">
            <InputField control={form.control} name="price" label="Price" type="number" placeholder="Price in INR" />
            <InputField control={form.control} name="mrp" label="MRP" type="number" placeholder="MRP in INR" />
          </div>
          <div className="flex flex-col mobile:flex-row gap-3">
            <WarehouseInput
              label="Warehouse"
              warehouses={warehouses}
              setWarehouses={setWarehouses}
              defaultWarehouses={defaultWarehouses}
            />
            <SelectProductType
              value={productType}
              onChange={setProductType}
              isLoading={false}
              data={defaultTypes}
              label="Product Type"
            />
          </div>
          <div className="flex gap-3">
            <SelectFields value={category} onChange={setCategory} data={categories} label="Category" />
            <SelectFields value={subCategory} onChange={setSubCategory} data={subCategories} label="Sub Category" />
          </div>
          <div className="flex gap-3">
            <SizeCategory
              value={sizeCategory}
              onChange={setSizeCatgory}
              setSizes={setSizes}
              isLoading={false}
              data={sizeCategories}
              label="Size Category"
            />
            <SizeDetails
              label="Size Details"
              colors={colors}
              sizes={sizes}
              setSizes={setSizes}
              sizeCategory={sizeCategory}
              defaultSizes={defaultSizes.filter((item) => item.type === sizeCategory)}
            />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <div className="flex gap-3 w-full">
              <InputField control={form.control} name="material" label="Material" placeholder="Enter product material" />
              <GenderInput genders={genders} setGenders={setGenders} />
            </div>
          </div>
          <AttributesInput
            label="Attributes"
            attributes={attributes}
            setAttributes={setAttributes}
            defaultAttributes={defaultAttributes}
          />
          <div className="w-full flex gap-5">
            <SwitchField control={form.control} name="inStock" label="In Stock" />
            <SwitchField control={form.control} name="isNewArrival" label="New Arrival" />
          </div>

          <Button
            type="submit"
            className={`${loading ? "bg-gray-500" : "bg-gray-700"} rounded-[5px] h-10 text-lg font-semibold my-5`}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditProductPage;
