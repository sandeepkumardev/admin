import React, { useState } from "react";
import ImagesGrid from "./ImagesGrid";
import { Button } from "@/components/ui/button";
import { TwitterPicker } from "react-color";
import { IColor, IImageFile } from "@/types";
import { error } from "@/lib/utils";
import { useFileStore } from "@/stores/product";

interface Props {
  colors: IColor[];
  setColors: (colors: IColor[]) => void;
  defaultColors: IColor[];
}

const ImageContainer = ({ colors, setColors, defaultColors }: Props) => {
  const [currentColor, setCurrentColor] = useState();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const pickedColor = (color: string) => {
    const isExist = colors.findIndex((c) => c.hex.toUpperCase() === color);
    if (isExist !== -1) return error("Color already selected!");

    setColors([...colors, defaultColors.filter((c) => c.hex.toUpperCase() === color)[0]]);
    setDisplayColorPicker(false);
  };

  return (
    <div>
      <div>
        <Button variant="outline" className="flex items-center" onClick={() => setDisplayColorPicker(!displayColorPicker)}>
          <span className="mr-2 text-xl mt-[-3px]">+</span> Add Images
        </Button>
        <p className="text-sm">[640px / 800px]</p>
        {displayColorPicker ? (
          <div className="absolute z-[2]">
            <div
              className="fixed top-0 left-0 right-0 bottom-0"
              onClick={() => setDisplayColorPicker(!displayColorPicker)}
            />
            <TwitterPicker
              width="fit"
              className="picker top-[-20px] max-w-[278px]"
              triangle="hide"
              colors={defaultColors.map((c) => c.hex)}
              color={currentColor || defaultColors[0]?.hex}
              onChange={(color: any) => {
                setCurrentColor(color.hex);
                pickedColor(color.hex.toUpperCase());
              }}
            />
          </div>
        ) : null}
      </div>

      {colors.map((color) => (
        <ColorContainer
          key={color.id}
          color={color.hex}
          colors={colors}
          setColors={setColors}
          defaultColors={defaultColors}
        />
      ))}
    </div>
  );
};

const ColorContainer = ({
  color,
  colors,
  setColors,
  defaultColors,
}: {
  color: string;
  colors: IColor[];
  setColors: (colors: IColor[]) => void;
  defaultColors: IColor[];
}) => {
  const { files, setFiles } = useFileStore();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const updateColor = (newColor: any) => {
    const isExist = colors.findIndex((c) => c.hex === newColor);
    if (isExist !== -1) return error("Color already selected!");

    setColors(colors.map((c) => (c.hex === color ? defaultColors.filter((c) => c.hex === newColor)[0] : c)));
    setFiles(
      files.map((f) => (f.color === color ? { ...f, color: newColor, key: f.key.split("-")[0] + "-" + newColor } : f))
    );
  };

  return (
    <div className="mt-5">
      <div className="flex gap-3 m-2 items-center relative">
        <p>{color}</p>
        <Button
          size={"icon"}
          style={{ backgroundColor: color }}
          className="border border-black rounded"
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
        ></Button>
        {displayColorPicker && (
          <div className="absolute z-[2]">
            <div className="fixed top-0 left-0 right-0 bottom-0" onClick={() => setDisplayColorPicker(false)} />
            <TwitterPicker
              width="fit"
              className="picker max-w-[278px] top-[50px]"
              triangle="hide"
              colors={defaultColors.map((c) => c.hex)}
              color={color}
              onChange={(newColor: any) => updateColor(newColor.hex.toUpperCase())}
            />
          </div>
        )}

        {files.filter((f) => f.color === color).length === 0 && (
          <Button
            variant="outline"
            size={"icon"}
            className="px-2 text-base font-bold text-red-500 rounded hover:border-gray-300"
            onClick={() => {
              setColors(colors.filter((c) => c.hex !== color));
            }}
          >
            X
          </Button>
        )}
      </div>
      <ImagesGrid files={files} setFiles={setFiles} color={color} />
    </div>
  );
};

export default ImageContainer;
