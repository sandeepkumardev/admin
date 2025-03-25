import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IColor, IProductSize, ISize } from "@/types";

interface Props {
  label: string;
  colors: IColor[];
  sizes: IProductSize[];
  setSizes: Dispatch<SetStateAction<IProductSize[]>>;
  defaultSizes: ISize[];
  sizeCategory: string;
}

const SizeDetails = ({ label, colors, sizes, setSizes, defaultSizes, sizeCategory }: Props) => {
  const sizeOptions = (hex: string) => {
    return defaultSizes
      ?.find((item) => item.type === sizeCategory)
      ?.value?.filter((item) => !sizes.some((size) => size.key === item && size.productColor === hex));
  };

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {colors.length === 0 && <p className="text-sm font-mono">Please add product images.</p>}

      {colors?.map((color, index) => (
        <div className="flex gap-1 flex-col pb-4" key={index}>
          <p className="border-l-8 pl-2" style={{ borderColor: color.hex }}>
            Sizes for color {color.name}
          </p>

          {sizes
            ?.filter((i) => i.productColor === color.hex)
            .map((item, index) => (
              <div className="flex gap-1" key={index}>
                <Input value={item.key} aria-checked className="text-base font-semibold w-14" readOnly />
                <Input
                  type="number"
                  className="text-base w-16 placeholder:text-sm p-1"
                  placeholder="Qnt."
                  value={item.quantity === 0 ? "" : item.quantity}
                  onChange={(e) => {
                    const objIndex = sizes.findIndex((k) => k.key === item.key && k.productColor === item.productColor);
                    const obj = {
                      index: sizes[objIndex].index,
                      key: sizes[objIndex].key,
                      value: sizes[objIndex].value,
                      quantity: Number(e.target.value),
                      productColor: sizes[objIndex].productColor,
                    };
                    setSizes([...sizes.slice(0, objIndex), obj, ...sizes.slice(objIndex + 1)]);
                  }}
                />
                <Input
                  value={item.value}
                  className="w-full text-base placeholder:text-xs placeholder:font-normal"
                  type="text"
                  placeholder="Chest (in Inch): 43.0 | Front Length (in Inch): 28.0 | Sleeve Length (in Inch): 9.75"
                  onChange={(e) => {
                    const objIndex = sizes.findIndex((k) => k.key === item.key && k.productColor === item.productColor);
                    const obj = {
                      index: sizes[objIndex].index,
                      key: sizes[objIndex].key,
                      quantity: sizes[objIndex].quantity,
                      value: e.target.value,
                      productColor: sizes[objIndex].productColor,
                    };
                    setSizes([...sizes.slice(0, objIndex), obj, ...sizes.slice(objIndex + 1)]);
                  }}
                />
                <Button
                  type="button"
                  variant={"outline"}
                  className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
                  onClick={() => {
                    const objIndex = sizes.findIndex((k) => k.key === item.key && k.productColor === item.productColor);
                    setSizes(sizes.slice(0, objIndex).concat(sizes.slice(objIndex + 1)));
                  }}
                >
                  X
                </Button>
              </div>
            ))}

          {/* {sizes?.length > 0 && <div className="w-full h-1 bg-gray-200"></div>} */}

          {sizeOptions(color.hex)?.length !== 0 && (
            <Select
              onValueChange={(value) => {
                const index = defaultSizes.find((i) => i.type === sizeCategory)?.value.indexOf(value) || 0;
                const obj = { index: index, key: value, quantity: 0, value: "", productColor: color.hex };
                const newArr = [...sizes, obj].sort((a, b) => a.index - b.index);
                setSizes(newArr);
              }}
              value=""
            >
              <SelectTrigger className="text-base">
                <SelectValue placeholder={`Select the Size`} />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions(color.hex)?.map((size, index) => (
                  <SelectItem key={index} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </FormItem>
  );
};

export default SizeDetails;
