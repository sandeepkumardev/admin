import { Warehouse } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WarehousesPage from "@/app/(root)/warehouses/_components/WarehousesPage";
import { getData } from "@/lib/utils";
export const dynamic = "force-dynamic";

const Page = async () => {
  const data = await getData("/api/warehouse");

  return (
    <main>
      <div className="flex items-center justify-between gap-3 md:py-4 md:px-2">
        <div className="flex flex-col">
          <div className="head-text flex gap-3">
            <Warehouse className="mt-[2px] h-5 w-5 sm:h-6 sm:w-6" />
            <h2>Warehouses</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">Create or Manage Warehouses</p>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Warehouses</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {!data ? <div>failed to load</div> : <WarehousesPage data={data} />}
    </main>
  );
};

export default Page;
