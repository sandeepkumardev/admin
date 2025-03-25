"use client";

import Image from "next/legacy/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IProduct, IProductSize } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { boldNumbersInString, getDiscount } from "@/lib/utils";

const ProductDetails = ({ data }: { data: IProduct }) => {
  const [currentColor, setCurrentColor] = useState(data.colors[0].hex);

  return (
    <div className="mobile:py-5">
      <div className="flex flex-col tablet:flex-row">
        <LeftGallaryView images={data.images} currentColor={currentColor} video={data.video} />
        <ProductDetail data={data} currentColor={currentColor} setCurrentColor={setCurrentColor} />
      </div>
    </div>
  );
};

const LeftGallaryView = ({
  images,
  currentColor,
  video,
}: {
  images: IProduct["images"];
  currentColor: string;
  video: string;
}) => {
  const [currentSlide, setCurrentSlide] = useState({
    type: "image",
    url: images.filter((image) => image.color === currentColor)[0].url,
  });

  const handleSlideChange = (type: string, url: string) => {
    setCurrentSlide({ type, url });
  };

  useEffect(() => {
    setCurrentSlide({
      type: "image",
      url: images.filter((image) => image.color === currentColor)[0].url,
    });
  }, [currentColor]);

  return (
    <div className="w-full tablet:w-auto flex flex-col justify-center gap-1 mobile:flex-row-reverse">
      <div className="relative w-full mobile:w-[500px] tablet:w-[350px] laptop:w-[500px] transition-all">
        <AspectRatio ratio={0.8 / 1} className="border rounded-md relative">
          {currentSlide.type === "image" ? (
            <Image
              priority
              src={currentSlide.url}
              quality={100}
              className="w-full h-full object-cover rounded-md"
              alt="product"
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <video
              controls
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate "
              autoPlay
              muted
              className="w-full h-full"
            >
              <source src={video} type="video/mp4" />
            </video>
          )}
        </AspectRatio>
      </div>

      <div className="flex justify-between w-full h-[300px] mobile:flex-col mobile:w-[100px] tablet:w-[70px] laptop:w-[100px] transition-all overflow-y-scroll no-scrollbar">
        {images
          .filter((image) => image.color === currentColor)
          .map((image, index) => (
            <div key={index} className={`cursor-pointer w-full`}>
              <AspectRatio ratio={0.8 / 1} className="border rounded-md">
                <Image
                  priority
                  key={image.key}
                  src={image.url.split("/upload")[0] + "/upload/w_80/" + image.url.split("/upload")[1]}
                  alt="product"
                  className="w-full h-full object-cover rounded-md"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onMouseEnter={() => {
                    if (currentSlide.url === image.url) return;
                    handleSlideChange("image", image.url);
                  }}
                />
              </AspectRatio>
            </div>
          ))}
        {video && (
          <div className={`cursor-pointer w-full`}>
            <AspectRatio ratio={0.8 / 1} className="border rounded-md">
              <video
                className="w-full h-full"
                onMouseEnter={() => {
                  if (currentSlide.url === video) return;
                  handleSlideChange("video", video);
                }}
              >
                <source src={video} type="video/mp4" />
              </video>
            </AspectRatio>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = ({
  data,
  currentColor,
  setCurrentColor,
}: {
  data: IProduct;
  currentColor: string;
  setCurrentColor: Dispatch<SetStateAction<string>>;
}) => {
  const [selectedSize, setSelectedSize] = useState<IProductSize>();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative w-full px-2 mt-2 tablet:mt-0 laptop:px-5">
      {!data.inStock && (
        <div className="absolute top-0 right-[-70px] rotate-45 w-[200px] text-center bg-red-500 px-2 py-1 rounded text-white text-xs">
          <p>Out of stock</p>
        </div>
      )}

      <div className="text-sm font-semibold text-light-3 mb-5">
        {data.category?.parent?.name} / {data.category?.name}
      </div>

      <Link href={`/e/${data.slug}?path=/p/${data.slug}`}>
        <Button variant="outline" size="sm" className="mr-2 text-lg border-blue-700">
          Edit
        </Button>
      </Link>

      <div className="flex items-center gap-2 mt-5">
        <p>SKU: {data.sku}</p>
      </div>

      <h2 className="text-xl font-bold">{data.name}</h2>
      <div>
        <p className={`${!showMore && "line-clamp-3"}`}>{data.description}</p>
        <span onClick={() => setShowMore(!showMore)} className="text-sm font-semibold text-blue-700 cursor-pointer">
          {!showMore ? "Read more" : "Read less"}
        </span>
      </div>
      <div className="flex mt-5 items-end gap-2">
        <p className="text-xl font-semibold">Rs. {data.price}</p>
        <p className="text-sm font-normal text-light-3 line-through">MRP {data.mrp}</p>
        <p className="text-lg text-green-600 font-semibold">{getDiscount(data.mrp, data.price)}% off</p>
      </div>
      <span className="text-sm font-normal text-light-3">incl. of all taxes</span>
      <div className="border w-fit border-light-3 px-3 my-5">
        <p className="text-base font-semibold text-light-3">{data.material}</p>
      </div>
      <p className="text-base mobile:text-lg font-semibold text-dark-3 uppercase mt-5">Colors</p>
      <div className="flex gap-1 items-center">
        {data.colors.map((color) => (
          <div
            key={color.id}
            className="rounded-full cursor-pointer shadow-gray-500 shadow-sm"
            style={{
              border: currentColor === color.hex ? `2px solid green` : "2px solid transparent",
              padding: "2px",
            }}
            onClick={() => setCurrentColor(color.hex)}
          >
            <div className="h-[30px] w-[30px] rounded-full" style={{ backgroundColor: color.hex }}></div>
          </div>
        ))}
      </div>
      <p className="text-base mobile:text-lg font-semibold text-dark-3 uppercase mt-5">Select Size</p>
      <div className="flex gap-2">
        {data.sizes.map(
          (size) =>
            size.productColor === currentColor && (
              <div key={size.key} className={`cursor-pointer`} onClick={() => setSelectedSize(size)}>
                <div
                  key={size.key}
                  className={`border-2 ${
                    size.key === selectedSize?.key ? "border-2 border-yellow-400 bg-yellow-400" : ""
                  } px-3 py-1`}
                >
                  <p className="text-base mobile:text-lg font-semibold text-dark-3">{size.key}</p>
                </div>
                {size.quantity && <p className="text-xs font-semibold">{size.quantity} Left</p>}
              </div>
            )
        )}
      </div>
      {selectedSize && selectedSize.productColor === currentColor && (
        <p className="text-sm font-normal mt-2">
          <span>
            Size: <b>{selectedSize?.key}</b>
          </span>
          <span className="ml-2" dangerouslySetInnerHTML={{ __html: boldNumbersInString(selectedSize?.value as string) }} />
        </p>
      )}

      <p className="text-xl font-semibold text-dark-3 mt-5">Key Highlights</p>
      <div className="grid grid-cols-2 gap-5 mt-3">
        {data.attributes.map((item, index) => (
          <div key={index} className="text-lg text-dark-3">
            <p className="font-semibold">{item.key}</p>
            <p>{item.value}</p>
            <div className="w-full mobile:w-1/2 h-[1px] bg-light-3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
