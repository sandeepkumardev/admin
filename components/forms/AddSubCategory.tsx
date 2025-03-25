import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { createSubCategoryDB } from "@/lib/actions/category.action";
import { ICategory } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";
import { error, success } from "@/lib/utils";

const AddSubCategory = ({ parentCategories: data, isLoading }: { parentCategories: ICategory[]; isLoading: boolean }) => {
  const { addCategory, categories, setCategories } = useCategoryStore();
  const [name, setName] = useState("");
  const [autoGen, setAutoGen] = useState(true);
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [wearType, setWearType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    setName(e.target.value);
    if (autoGen) setSlug(e.target.value.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!parentId) return error("Please select a parent category");
    if (!name) return error("Name is required");
    if (!wearType) return error("Wear type is required");

    setLoading(true);
    const res = await createSubCategoryDB(parentId, capitalize(name.trim()), slug, wearType);
    setLoading(false);
    if (!res?.ok) {
      error(res?.error || "Something went wrong");
    } else {
      setName("");
      setSlug("");
      setWearType("");
      setParentId("");
      success("Sub category created successfully");
      // @ts-ignore
      addCategory(res?.data); // Add the new category to the store
    }
  };

  useEffect(() => {
    if (categories.length === 0) setCategories(data);
  }, []);

  return (
    <form className="flex flex-col justify-start gap-5 border p-2" onSubmit={onSubmit}>
      <Select onValueChange={(v) => setParentId(v)} value={parentId}>
        <SelectTrigger className="text-base" disabled={isLoading}>
          <SelectValue placeholder={isLoading ? "Loading..." : "Select the category"} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <Label className="text-base text-dark-3">Sub Category Name</Label>
        <Input
          type="text"
          className="account-form_input no-focus mt-2"
          placeholder="Enter sub category name"
          value={name}
          onChange={handleInput}
        />
        <div className="flex items-center gap-2 my-1">
          <Checkbox
            id="offer"
            checked={autoGen}
            onCheckedChange={(val: boolean) => {
              setAutoGen(val);
              if (val) setSlug(name.trim().replace(/\s+/g, "-").toLowerCase());
            }}
          />
          <label htmlFor="offer" className="text-sm select-none">
            Auto generate slug
          </label>
        </div>
        <Input
          type="text"
          className="no-focus"
          value={slug}
          placeholder="Category slug"
          disabled={autoGen}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      <RadioGroup className="flex" value={wearType} onValueChange={setWearType}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="topwear" id="topwear" />
          <Label htmlFor="topwear">TopWear</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bottomwear" id="bottomwear" />
          <Label htmlFor="bottomwear">BottomWear</Label>
        </div>
      </RadioGroup>

      <Button type={loading ? "button" : "submit"} className="bg-dark-3 w-[100px] rounded-xl">
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
};

export default AddSubCategory;
