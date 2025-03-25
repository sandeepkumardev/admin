"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSubCategory from "@/components/forms/AddSubCategory";
import AddCategory from "@/components/forms/AddCategory";
import { ICategory } from "@/types";

const CategoryTabs = ({ isLoading, parentCategories }: { isLoading: boolean; parentCategories: ICategory[] }) => {
  const [categoryType, setCategoryType] = useState("sub-category");

  return (
    <Tabs defaultValue={categoryType} className="">
      <TabsList className="w-full">
        <TabsTrigger value="sub-category" className="w-full" onClick={() => setCategoryType("sub-category")}>
          Sub-Category
        </TabsTrigger>
        <TabsTrigger value="parent-category" className="w-full" onClick={() => setCategoryType("parent-category")}>
          Category
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sub-category">
        <AddSubCategory parentCategories={parentCategories} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="parent-category">
        <AddCategory />
      </TabsContent>
    </Tabs>
  );
};

export default CategoryTabs;
