"use client";

import DataTable from "./data-table";
import { columns } from "./columns";

const ProductsPage = ({ products, categories }: { products: any[]; categories: any[] }) => {
  return (
    <div>
      <DataTable isLoading={false} columns={columns} data={products || []} categories={categories || []} />
    </div>
  );
};

export default ProductsPage;
