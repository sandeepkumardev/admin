import { getData } from "@/lib/utils";
import Details from "./_components/Details";
export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { id: string } }) => {
  const collection = await getData(`/api/collections/${params.id}`);
  const products = await getData(`/api/products?group-data`);

  return (
    <>
      <Details id={params.id} collection={collection} products={products} />
    </>
  );
};

export default Page;
