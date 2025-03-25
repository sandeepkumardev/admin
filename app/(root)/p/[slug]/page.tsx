import ProductDetails from "@/app/(root)/p/[slug]/_components/ProductDetails";
import { getData } from "@/lib/utils";
export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(`/api/products/${params.slug}`);

  if (!data) return <p>Product not found</p>;
  return <ProductDetails data={data} />;
};

export default Page;
