import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getData } from "@/lib/utils";
import OrdersPage from "@/app/(root)/orders/_components/OrdersPage";
import { Package } from "lucide-react";
export const dynamic = "force-dynamic";

const page = async () => {
  const data = await getData("/api/orders");

  return (
    <main>
      <div className="flex items-center justify-between gap-3 md:py-4 md:px-2">
        <div className="flex flex-col">
          <div className="head-text flex gap-3">
            <Package className="mt-[2px] h-5 w-5 sm:h-6 sm:w-6" />
            <h2>Orders</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">View and manage orders</p>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {!data ? <div>failed to load</div> : <OrdersPage data={data} />}
    </main>
  );
};

export default page;
