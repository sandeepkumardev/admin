import * as z from "zod";

export const productValidation = z
  .object({
    sku: z.string().min(3, { message: "Minimum 3 characters." }),
    name: z.string().min(3, { message: "Minimum 3 characters." }),
    description: z.string().min(3, { message: "Minimum 3 characters." }),
    price: z
      .string()
      .nonempty({ message: "Please enter the price." })
      .refine((value) => !isNaN(Number(value)), { message: "Price must be a valid number." })
      .refine((value) => Number(value) > 0, { message: "Price should be greater than 0." })
      .refine((value) => Number.isInteger(Number(value)), {
        message: "Price must be a whole number. No decimals allowed.",
      }),
    mrp: z
      .string()
      .nonempty({ message: "Please enter the MRP." })
      .refine((value) => !isNaN(Number(value)), { message: "MRP must be a valid number." })
      .refine((value) => Number(value) > 0, { message: "MRP should be greater than 0." })
      .refine((value) => Number.isInteger(Number(value)), {
        message: "MRP must be a whole number. No decimals allowed.",
      }),
    material: z.string().nonempty({ message: "Please enter the material." }),
    inStock: z.boolean(),
    isNewArrival: z.boolean(),
  })
  .refine((data) => Number(data.mrp) > Number(data.price), {
    message: "MRP should be greater than price.",
    path: ["mrp"],
  });
