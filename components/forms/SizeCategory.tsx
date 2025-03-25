import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { capitalize } from "lodash";
import { IProductSize } from "@/types";

const SizeCategory = ({
  value,
  onChange,
  setSizes,
  data,
  label,
  isLoading = false,
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  setSizes: Dispatch<SetStateAction<IProductSize[]>>;
  data: string[];
  label: string;
  isLoading?: boolean;
}) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>
      <Select
        onValueChange={(v) => {
          setSizes([]);
          onChange(v);
        }}
        value={value}
      >
        <SelectTrigger className="text-base">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select"} />
        </SelectTrigger>
        <SelectContent>
          {data?.map((item) => (
            <SelectItem key={item} value={item}>
              {capitalize(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default SizeCategory;
