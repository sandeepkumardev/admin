// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { createAttribute } from "@/lib/actions/attribute.action";
// import { error, success } from "@/lib/utils";
// import { IAttribute } from "@/types";
// import { useEnumsStore } from "@/stores/enums";
// import { capitalize } from "lodash";

// const Attributes = () => {
//   const { addAttributeKey } = useEnumsStore();
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async () => {
//     if (name.length < 3) return error("Attribute name must be at least 3 characters long");

//     setLoading(true);
//     // const res = await createAttribute(capitalize(name.trim()));
//     setLoading(false);
//     // if (!res?.ok) return error(res?.error);

//     // addAttributeKey(res?.data as IAttribute);
//     success("Attribute created successfully");
//     setName("");
//   };

//   return (
//     <div className="px-2 flex flex-col gap-2 pt-[1px]">
//       <Input placeholder="Attribute name" value={name} onChange={(e) => setName(e.target.value)} />
//       <Button disabled={loading || name === ""} className="bg-dark-3 w-[100px] rounded-xl" onClick={onSubmit}>
//         {loading ? "Adding..." : "Add"}
//       </Button>
//     </div>
//   );
// };

// export default Attributes;
