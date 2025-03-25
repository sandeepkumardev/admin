"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { addWareHouse } from "@/lib/actions/warehouse.action";
import InputField from "./InputField";
import { error, success } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = Yup.object({
  contactPersonName: Yup.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .required("Contact Person Name is required"),
  contactPersonMobile: Yup.string()
    .length(10, { message: "Mobile number must be at least 10 digits long" })
    .required("Mobile number is required"),
  contactPersonEmail: Yup.string().email({ message: "Invalid email address" }).required("Email is required"),
  warehouseName: Yup.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .required("Warehouse Name is required"),
  address: Yup.string().min(3, { message: "Address must be at least 3 characters long" }).required("Address is required"),
  city: Yup.string().min(3, { message: "City must be at least 3 characters long" }).required("City is required"),
  state: Yup.string().min(3, { message: "State must be at least 3 characters long" }).required("State is required"),
  country: Yup.string().min(3, { message: "Country must be at least 3 characters long" }).required("Country is required"),
  pincode: Yup.string().min(3, { message: "Pincode must be at least 4 characters long" }).required("Pincode is required"),
});

const CreateWarehousePage = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      contactPersonName: "",
      contactPersonMobile: "",
      contactPersonEmail: "",
      warehouseName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        formik.isSubmitting = true;
        console.log({ values });
        const res = await addWareHouse(values);
        if (!res?.ok) {
          error(res?.error || "Something went wrong");
          return;
        }

        formik.resetForm();
        success("Warehouse added successfully");
        // router.push("/warehouses");
        window.location.href = "/warehouses";
      } catch (err) {
        console.error(err);
        error("Something went wrong");
      } finally {
        formik.isSubmitting = false;
      }
    },
  });

  return (
    <div className="laptop:px-4 max-w-mobile mt-5 sm:mt-2">
      <form onSubmit={formik.handleSubmit} className="space-y-3 mt-0">
        <InputField formik={formik} label="Contact Person Name" name="contactPersonName" placeholder="Name" />
        <InputField formik={formik} label="Contact Person Mobile" name="contactPersonMobile" placeholder="Mobile" />
        <InputField formik={formik} label="Contact Person Email" name="contactPersonEmail" placeholder="Email" />
        <InputField formik={formik} label="Address" placeholder="Address" />
        <div className="flex gap-4">
          <InputField formik={formik} label="City" placeholder="City" />
          <InputField formik={formik} label="State" placeholder="State" />
        </div>
        <div className="flex gap-4">
          <InputField formik={formik} label="Country" placeholder="Country" />
          <InputField formik={formik} label="Pincode" placeholder="Pincode" type="number" />
        </div>
        <InputField
          formik={formik}
          onChange={(e) => formik.setFieldValue("warehouseName", e.target.value.split(" ").join("-").toLowerCase())}
          label="Warehouse Name"
          name="warehouseName"
          placeholder="Warehouse Name"
        />
        <Button type="submit" className="rounded" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "adding..." : "Add Warehouse"}
        </Button>
      </form>
    </div>
  );
};

export default CreateWarehousePage;
