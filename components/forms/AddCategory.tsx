import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createCategoryDB } from "@/lib/actions/category.action";
import { ChangeEvent, useState } from "react";
import { Label } from "../ui/label";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";
import { error, success } from "@/lib/utils";

const AddCategory = () => {
  const { addCategory } = useCategoryStore();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    setName(e.target.value);
    setSlug(e.target.value.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return error("Name is required");

    setLoading(true);
    const res = await createCategoryDB(capitalize(name.trim()), slug);
    setLoading(false);

    if (!res?.ok) {
      error(res?.error || "Something went wrong");
    } else {
      setName("");
      setSlug("");
      success("Category created successfully");
      // @ts-ignore
      addCategory(res?.data); // add the new category to the store
    }
  };

  return (
    <form className="flex flex-col justify-start gap-3 border p-2" onSubmit={onSubmit}>
      <Label className="text-base text-dark-3">Category Name</Label>
      <div>
        <Input
          type="text"
          className="account-form_input no-focus"
          placeholder="Enter category name"
          value={name}
          onChange={handleInput}
        />
        <Label className="account-form_label text-sm text-dark-3">{slug}</Label>
      </div>

      <Button type={loading ? "button" : "submit"} className="bg-dark-3 w-[100px] rounded-xl">
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
};

export default AddCategory;
