"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Switch } from "@/components/ui/switch";
import { createSlug, fetcher, fetchOpt, getPublicId } from "@/lib/utils";
import { ICollection, IProduct } from "@/types";
import Image from "next/image";
import React, { ChangeEvent, useEffect } from "react";
import useSWR from "swr";
import { MdAddCircleOutline, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
// import { useCollectionStore } from "@/stores/collections";
import { updateCollectionDB, updateCollectionProductsDB } from "@/lib/actions/collection.action";
import { useRouter } from "next/navigation";

const Details = ({ id, collection, products }: { id: string; collection: ICollection; products: IProduct[] }) => {
  // const { updateCollection } = useCollectionStore();
  const data: ICollection = collection;
  const productsData: IProduct[] = products;

  const [productsList, setProductsList] = React.useState<IProduct[]>([]);
  const [addedProducts, setAddedProducts] = React.useState<IProduct[]>([]);
  const [values, setValues] = React.useState<{
    name?: string;
    isActive?: boolean;
    isGallery?: boolean;
    icon?: string;
    image?: string;
    banner?: string;
  }>();
  const [icon, setIcon] = React.useState<{ blob?: string; status?: string }>();
  const [image, setImage] = React.useState<{ blob?: string; status?: string }>();
  const [banner, setBanner] = React.useState<{ blob?: string; status?: string }>();
  const [edit, setEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isProductExist = (id: string) => addedProducts.some((product) => product.id === id);

  function isProductsUpdated(key: string) {
    if (data?.products?.length !== addedProducts?.length) return false;
    return data?.products.every((item1) =>
      addedProducts.some((item2) => {
        // @ts-ignore
        return item2[key] === item1[key];
      })
    );
  }

  const handleUpdateCollection = async () => {
    setLoading(true);
    const data = { ...values, slug: createSlug(values?.name || "") };
    const res = await updateCollectionDB({ id: id, data });
    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res?.error || "Something went wrong",
      });
      setLoading(false);
      return;
    }

    toast({
      variant: "success",
      title: "Updated",
      description: `Successfully updated!`,
    });
    setEdit(false);
    setLoading(false);
    // updateCollection(params.id, data);
    window.location.reload();
  };

  const uploadFile = async (file: globalThis.File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/image", { method: "POST", body: formData });
    return await response.json();
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>, type: string) => {
    e.preventDefault();

    if (e.target.files) {
      const file = e.target.files[0];
      if (type === "icon") {
        setIcon({ ...icon, status: "uploading..." });
      }
      if (type === "image") {
        setImage({ ...image, status: "uploading..." });
      } else if (type === "banner") {
        setBanner({ ...banner, status: "uploading..." });
      }
      const publicId = getPublicId(data?.image || data?.icon);
      const res = await uploadFile(file as globalThis.File);
      if (res.ok) {
        await fetch(`/api/image?public_ids=${publicId}`, { method: "DELETE" });
        if (type === "icon") {
          setValues({ ...values, icon: res.data.secure_url });
          setIcon({ blob: URL.createObjectURL(file), status: "" });
        }
        if (type === "image") {
          setValues({ ...values, image: res.data.secure_url });
          setImage({ blob: URL.createObjectURL(file), status: "" });
        } else if (type === "banner") {
          setValues({ ...values, banner: res.data.secure_url });
          setBanner({ blob: URL.createObjectURL(file), status: "" });
        }
      } else {
        if (type === "image") {
          setImage({ status: "error" });
        } else if (type === "banner") {
          setBanner({ status: "error" });
        } else {
          setIcon({ status: "error" });
        }
      }
    }
  };

  const handleUpdateProducts = async () => {
    setLoading(true);
    await updateCollectionProductsDB({
      collectionId: data?.id,
      products: addedProducts.map((product) => product.id) as string[],
    });
    toast({
      variant: "success",
      title: "Updated",
      description: `Successfully updated!`,
    });
    setEdit(false);
    setLoading(false);
    data.products = addedProducts;
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setValues({ ...data, icon: data.icon, image: data.image, banner: data.banner });
  };

  useEffect(() => {
    setProductsList(productsData);
  }, [productsData]);

  useEffect(() => {
    setAddedProducts(data?.products || []);
    setValues({
      name: data?.name,
      isActive: data?.isActive,
      isGallery: data?.isGallery,
      icon: data?.icon,
      image: data?.image,
      banner: data?.banner,
    });
  }, [data]);

  if (!collection) return <div className="text-center text-xl text-light-3">No data</div>;

  return (
    <div className="w-full">
      <div className="relative">
        <AspectRatio ratio={3.57 / 1}>
          <Image
            src={banner?.blob || data.banner}
            alt="Image"
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-md object-contain w-full h-full"
          />
        </AspectRatio>
        {edit && (
          <div className="text-sm absolute top-1 right-1 bg-blue-100 px-2 pb-[1px] rounded font-semibold text-red-500 cursor-pointer">
            {banner?.status ? (
              banner?.status
            ) : (
              <>
                <Label htmlFor="banner" className="flex items-center gap-2 text-blue-700">
                  <CiEdit className="text-xl" /> Change
                </Label>
                <Input
                  id="banner"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImage(e, "banner")}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col mobile:flex-row gap-2 mt-2">
        <div className="relative w-full mobile:w-[200px]">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={data.isGallery ? icon?.blob || data.icon : image?.blob || data.image}
              alt="Image"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-md object-contain w-full h-full"
            />
          </AspectRatio>
          {edit && image?.status && <p>{image?.status}</p>}
          {edit &&
            (data.isGallery ? (
              <div className="text-sm absolute top-1 right-1 bg-blue-100 px-2 pb-[1px] rounded font-semibold text-red-500 cursor-pointer">
                {icon?.status ? (
                  icon?.status
                ) : (
                  <>
                    <Label htmlFor="image" className="flex items-center gap-2 text-blue-700">
                      <CiEdit className="text-xl" /> Change
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImage(e, "icon")}
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm absolute top-1 right-1 bg-blue-100 px-2 pb-[1px] rounded font-semibold text-red-500 cursor-pointer">
                {image?.status ? (
                  image?.status
                ) : (
                  <>
                    <Label htmlFor="image" className="flex items-center gap-2 text-blue-700">
                      <CiEdit className="text-xl" /> Change
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImage(e, "image")}
                    />
                  </>
                )}
              </div>
            ))}
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col gap-2 flex-1">
            {edit ? (
              <input
                type="text"
                className="p-1 border border-gray-200 rounded"
                value={values?.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            ) : (
              <h1 className="font-bold text-xl md:text-2xl font-sans">{values?.name}</h1>
            )}
            <div className="flex items-center gap-2">
              <p className="font-semibold">Active:</p>
              <Switch
                checked={values?.isActive}
                disabled={!edit}
                onCheckedChange={(e) => setValues({ ...values, isActive: e })}
                style={{ backgroundColor: values?.isActive ? "green" : "red" }}
              />
            </div>
          </div>
          {!edit ? (
            <FaEdit
              className="text-2xl md:text-3xl cursor-pointer p-1 text-gray-800 hover:bg-gray-100"
              onClick={() => setEdit(true)}
            />
          ) : (
            <>
              <Button variant={"outline"} className="text-sm rounded" size={"sm"} onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button className="text-sm rounded" size={"sm"} disabled={loading} onClick={handleUpdateCollection}>
                {loading ? "saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="text-xl md:text-2xl font-sans mt-4 text-nowrap">Products ({data.products?.length})</h1>
        {!isProductsUpdated("id") && (
          <Button size={"sm"} className="text-sm rounded" onClick={handleUpdateProducts}>
            Update
          </Button>
        )}
      </div>
      <Tabs defaultValue="added" className="mt-2 h-full">
        <TabsList className="w-full ">
          <TabsTrigger value="added" className="w-full text-base">
            Added
          </TabsTrigger>
          <TabsTrigger value="add-new" className="w-full text-base">
            Add New
          </TabsTrigger>
        </TabsList>
        <TabsContent value="added">
          <Command className="mt-2">
            <CommandInput className="w-full" placeholder="Type a category or search..." />
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>

              {addedProducts?.map((product: IProduct) => (
                <CommandItem key={product.id} className="flex justify-between items-center">
                  <Link href={`/p/${product.slug}`} className="text-[15px]">
                    {product.name}
                  </Link>
                  <MdDeleteOutline
                    className="text-xl cursor-pointer"
                    fill="red"
                    onClick={() => setAddedProducts(addedProducts.filter((p) => p.id !== product.id))}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </TabsContent>
        <TabsContent value="add-new">
          <Command className="mt-2">
            <CommandInput placeholder="Type a category or search..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No products found.</CommandEmpty>
              {productsList?.map((product: IProduct) => (
                <CommandItem key={product.id} className="flex justify-between items-center">
                  <Link href={`/p/${product.slug}`} className="text-[15px]">
                    {product.name}
                  </Link>
                  {isProductExist(product.id as string) ? (
                    <MdDeleteOutline
                      className="text-xl cursor-pointer"
                      fill="red"
                      onClick={() => setAddedProducts(addedProducts.filter((p) => p.id !== product.id))}
                    />
                  ) : (
                    <MdAddCircleOutline
                      className="text-xl cursor-pointer"
                      fill="green"
                      onClick={() => setAddedProducts([...addedProducts, product])}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Details;
