"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { error, success } from "@/lib/utils";
import { IColor } from "@/types";
import { useEnumsStore } from "@/stores/enums";
import { DeleteColor } from "@/components/dialogs/deleteColor";
import { createColorDB } from "@/lib/actions/color.action";
import { Input } from "@/components/ui/input";
import tinyColor from "tinycolor2";
import { SliderPicker } from "react-color";
import { capitalize } from "lodash";

const Colors = ({ colors: data, isLoading }: { colors: IColor[]; isLoading: boolean }) => {
  const { colors, addColor, setColors } = useEnumsStore();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === "" || hex === "") return error("Color is required");

    setLoading(true);
    const res = await createColorDB(capitalize(name.trim()), hex);
    setLoading(false);
    if (!res?.ok) return error(res?.error);

    addColor(res?.data as IColor);
    success("Color added successfully");
    setName("");
    setHex("");
  };

  const handleName = (e: any) => {
    setName(e.target.value);
    const color = tinyColor(e.target.value);
    setHex(color.toHexString());
  };

  useEffect(() => {
    if (colors.length === 0) setColors(data);
  }, []);

  return (
    <div className="px-2 flex flex-col gap-2 pt-[1px]">
      <form onSubmit={onSubmit} className="">
        <div className="flex gap-2">
          <Input type="text" placeholder="Color Name" value={name} onChange={handleName} />
          <Input
            type="text"
            accept="hex"
            placeholder="Color Hex - #fafafa"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
          />
        </div>
        {hex && (
          <div className="mt-2">
            <div className={`border h-20`} style={{ backgroundColor: hex }}></div>
            <SliderPicker color={hex} onChange={(color) => setHex(color.hex)} />
          </div>
        )}

        <Button
          disabled={loading || name === "" || hex === ""}
          className="bg-dark-3 w-[100px] rounded-xl mt-2"
          onClick={onSubmit}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>

      <h2 className="text-dark-3 text-lg font-semibold">Current Colors</h2>
      <div className="flex flex-wrap gap-2">
        {isLoading && <div>Loading...</div>}
        {colors.length === 0 && !isLoading && <div>No colors found</div>}
        {colors.map((color) => (
          <div key={color.id} className="flex items-center border border-dark-3 px-2 rounded gap-2">
            <div style={{ backgroundColor: color.hex }} className="w-6 h-6 "></div>
            <p className="text-dark-3 font-semibold  flex items-center gap-2 pr-1">
              {color.name} <DeleteColor name={color.name} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colors;
