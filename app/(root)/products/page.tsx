import { PackageSearch } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductsPage from "@/app/(root)/products/_components/ProductsPage";
import { getData } from "@/lib/utils";
export const dynamic = "force-dynamic";

const Page = async () => {
  const categories = await getData("/api/categories");
  const products = await getData("/api/products?table-data");

  return (
    <main>
      <div className="flex items-center justify-between gap-3 md:py-4 md:px-2">
        <div className="flex flex-col">
          <div className="head-text flex gap-3">
            <PackageSearch className="mt-[2px] h-5 w-5 sm:h-6 sm:w-6" />
            <h2>Products</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">Find products and manage them</p>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {!products ? <div>failed to load</div> : <ProductsPage products={products} categories={categories || []} />}
    </main>
  );
};

export default Page;
