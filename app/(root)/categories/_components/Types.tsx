"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { error, success } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { upperFirst } from "lodash";
import { createProductTypeDB } from "@/lib/actions/type.action";
import TypeAttributes from "./TypeAttributes";

const Types = () => {
  const { addType } = useEnumsStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 3) return error("Type must be at least 3 characters long");

    setLoading(true);
    const res = await createProductTypeDB(upperFirst(name.trim()));
    setLoading(false);
    if (!res?.ok) return error(res?.error);

    addType(res?.data?.id as string, res?.data?.name as string);
    success("Type created successfully");
    setName("");
  };

  return (
    <div className="px-2 flex flex-col pt-[1px]">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Add product type e.g. Shirt | T-Shirt"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded"
        />
        <Button disabled={loading || name === ""} className="bg-dark-3 w-[100px] rounded" onClick={onSubmit}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </form>

      <TypeAttributes />
    </div>
  );
};

export default Types;
