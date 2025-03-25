import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IAttribute, IProductAttribute } from "@/types";

interface Props {
  label: string;
  attributes: IProductAttribute[];
  setAttributes: Dispatch<SetStateAction<IProductAttribute[]>>;
  defaultAttributes: IAttribute[];
  productType: string;
}

const AttributesInput = ({ label, attributes, setAttributes, defaultAttributes, productType }: Props) => {
  const [selectedSize, setSelectedSize] = useState<string[]>([...attributes.map((i) => i.key)]);

  useEffect(() => {
    if (attributes.length === 0) setSelectedSize([]);
  }, [attributes]);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {defaultAttributes.length === 0 && !productType && (
        <span className="text-sm text-red-600">Please select the product type.</span>
      )}
      {defaultAttributes.length === 0 && productType && <span className="text-sm">No attributes available</span>}

      {selectedSize?.map((item, index) => (
        <div className="flex gap-3 py-[1px]" key={index}>
          <Input value={item} aria-checked className="text-sm font-semibold" readOnly />
          <Select
            value={attributes[index]?.value}
            onValueChange={(field) => {
              const obj = { key: selectedSize[index], value: field };
              setAttributes([...attributes.slice(0, index), obj, ...attributes.slice(index + 1)]);
            }}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder={`Select the value`} />
            </SelectTrigger>
            <SelectContent>
              {defaultAttributes
                ?.filter((attribute) => attribute.key === item)[0]
                ?.value?.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => {
              setAttributes(attributes.filter((k) => k.key !== item));
              setSelectedSize(selectedSize.filter((k) => k !== item));
            }}
          >
            X
          </Button>
        </div>
      ))}

      {attributes?.length > 0 && <div className="w-full h-1 my-2"></div>}

      {defaultAttributes.length !== selectedSize.length && (
        <Select
          onValueChange={(field) => {
            setAttributes([...attributes, { key: field, value: "" }]);
            setSelectedSize([...selectedSize, field]);
          }}
          value=""
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder={`Select the key`} />
          </SelectTrigger>
          <SelectContent>
            {defaultAttributes
              ?.filter((attribute) => !attributes.some((selected) => selected.key === attribute.key))
              .map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.key}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default AttributesInput;
