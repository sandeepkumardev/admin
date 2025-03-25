import React, { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { FormItem, FormLabel } from "../ui/form";
import { Cross1Icon } from "@radix-ui/react-icons";
import { defaultGenders } from "@/constants";

const GenderInput = ({
  genders,
  setGenders,
}: {
  genders: string[];
  setGenders: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const genderOptions = useMemo(() => {
    return defaultGenders.filter((item) => {
      if ((genders.includes("Male") && item === "Female") || (genders.includes("Female") && item === "Male")) {
        return false;
      }
      return !genders.includes(item);
    });
  }, [genders]);

  return (
    <FormItem className="flex w-full flex-col p-0 m-0">
      <FormLabel className="text-base text-dark-3">Gender</FormLabel>

      {genders.map((item, index) => (
        <div className="flex gap-3 items-center justify-between py-[1px]" key={index}>
          <div className="text-sm text-dark-3 ">{item}</div>
          <Cross1Icon
            className="cursor-pointer text-red-600"
            onClick={() => setGenders(genders.filter((i) => i !== item))}
          />
        </div>
      ))}

      {genders.length > 0 && <p className="w-full h-1 my-2"></p>}

      {genderOptions.length !== 0 && (
        <Select onValueChange={(value) => setGenders([...genders, value])}>
          <SelectTrigger className="w-full">
            <p>Select Gender</p>
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map((item) => (
              <SelectItem key={item} value={item} onClick={() => console.log(item)}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default GenderInput;
