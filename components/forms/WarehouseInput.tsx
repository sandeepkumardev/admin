import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IWarehouse } from "@/types";

interface Props {
  label: string;
  warehouses: {
    id: string;
    name: string;
  }[];
  setWarehouses: Dispatch<
    SetStateAction<
      {
        id: string;
        name: string;
      }[]
    >
  >;
  defaultWarehouses: IWarehouse[];
}

const WarehouseInput = ({ label, warehouses, setWarehouses, defaultWarehouses }: Props) => {
  const [selectedWarehouses, setSelectedWarehouses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setSelectedWarehouses(warehouses.map((k) => ({ id: k.id, name: k.name })));
  }, [warehouses]);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {defaultWarehouses?.length === 0 && <div className="text-sm text-red-500">No warehouses found</div>}

      {selectedWarehouses?.map((item, index) => (
        <div className="flex gap-2 py-[1px]" key={index}>
          <Input value={item.name} aria-checked className="text-sm font-semibold" readOnly />
          <Button
            type="button"
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => {
              setWarehouses(warehouses.filter((k) => k.id !== item.id));
              setSelectedWarehouses(selectedWarehouses.filter((k) => k !== item));
            }}
          >
            X
          </Button>
        </div>
      ))}

      {warehouses?.length > 0 && <div className="w-full h-1 my-2"></div>}

      {defaultWarehouses.length !== selectedWarehouses.length && (
        <Select
          onValueChange={(field) => {
            const name = defaultWarehouses.find((w) => w.id === field)?.warehouseName ?? "";
            setWarehouses([...warehouses, { id: field, name }]);
            setSelectedWarehouses([...selectedWarehouses, { id: field, name }]);
          }}
          value=""
        >
          <SelectTrigger className="text-base">
            <SelectValue placeholder={`Select`} />
          </SelectTrigger>
          <SelectContent>
            {defaultWarehouses
              ?.filter((dw) => !selectedWarehouses.some((w) => w.id === dw.id))
              .map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.warehouseName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
    </FormItem>
  );
};

export default WarehouseInput;
