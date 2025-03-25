"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import Settings from "./Settings";
import ProductTable from "./ProductTable";

const WarehousePage = ({ id }: { id: string }) => {
  const warehouse = useSWR(`/api/warehouse/${id}`, fetcher, fetchOpt);

  if (warehouse?.isLoading) return <div className="text-center text-xl text-light-3">Loading...</div>;
  if (!warehouse?.data?.data) return <div className="text-center text-xl text-light-3">No warehouse found</div>;

  return (
    <>
      <Tabs defaultValue="manage" className="mt-2 h-full">
        <TabsList className="w-full rounded">
          <TabsTrigger value="manage" className="w-full text-base rounded">
            Manage
          </TabsTrigger>
          <TabsTrigger value="settings" className="w-full text-base rounded">
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <ProductTable data={warehouse?.data?.data} refetch={warehouse?.mutate} />
        </TabsContent>
        <TabsContent value="settings">
          <Settings data={warehouse?.data?.data} refetch={warehouse?.mutate} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default WarehousePage;
