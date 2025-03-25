import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { deleteWareHouse, updateWareHouse } from "@/lib/actions/warehouse.action";
import { error } from "@/lib/utils";
import { IWarehouse } from "@/types";
import { CheckCircle, Circle, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Settings = ({ data, refetch }: { data: IWarehouse; refetch: any }) => {
  const navigate = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editField, setEditField] = useState(null as string | null);
  const [editData, setEditData] = useState({
    contactPersonName: data.contactPersonName,
    contactPersonEmail: data.contactPersonEmail,
    contactPersonMobile: data.contactPersonMobile,
    warehouseName: data.warehouseName,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    pincode: data.pincode,
  });

  const handleChange = (field: keyof typeof editData, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field: string) => {
    if (!field) return;

    setIsEditing(true);
    const response = await updateWareHouse(data.id, {
      [field]:
        field === "contactPersonMobile"
          ? Number(editData[field as keyof typeof editData])
          : editData[field as keyof typeof editData],
    });
    setIsEditing(false);

    if (!response?.ok) {
      error(response?.error || "Something went wrong");
      return;
    }

    refetch();
    setEditField(null);
  };

  const handleEdit = (field: string | null) => {
    if (editField) setEditData((prev) => ({ ...prev, [editField]: data[editField as keyof IWarehouse] }));
    setEditField(field);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const response = await deleteWareHouse(data.id);
    setIsDeleting(false);
    if (!response?.ok) {
      error(response?.error || "Something went wrong");
      return;
    }

    // navigate.replace("/warehouses");
    window.location.href = "/warehouses";
  };

  return (
    <div className="max-w-tablet mx-auto mt-3">
      <h2 className="text-lg font-semibold">Update Details</h2>
      <>
        <EditableField
          id="contactPersonName"
          label="Contact Person Name"
          value={editData.contactPersonName}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("contactPersonName", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="contactPersonEmail"
          label="Contact Person Email"
          value={editData.contactPersonEmail}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("contactPersonEmail", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="contactPersonMobile"
          label="Contact Person Mobile"
          type="number"
          value={editData.contactPersonMobile}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("contactPersonMobile", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="warehouseName"
          label="Warehouse Name"
          value={editData.warehouseName}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("warehouseName", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="address"
          label="Address"
          value={editData.address}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("address", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="city"
          label="City"
          value={editData.city}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("city", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="state"
          label="State"
          value={editData.state}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("state", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="country"
          label="Country"
          value={editData.country}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("country", value)}
          isEditing={isEditing}
        />
        <EditableField
          id="pincode"
          label="Pincode"
          value={editData.pincode}
          editField={editField}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
          onChange={(value: string) => handleChange("pincode", value)}
          isEditing={isEditing}
        />
      </>

      <div className="h-[1px] w-full bg-gray-200 my-5"></div>

      <div>
        <h4 className="text-lg font-semibold text-red-500">Delete Warehouse</h4>
        <p className="text-sm text-gray-500">
          Once you delete the warehouse, you will not be able to recover it. Are you sure you want to delete this warehouse?
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"destructive"} className="rounded" size={"sm"} disabled={isDeleting}>
                Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm">Are you sure you want to delete this warehouse?</p>
              <div className="flex justify-end gap-2 mt-2">
                <Button size={"sm"} className="rounded" variant={"destructive"} onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

const EditableField = ({ id, label, value, editField, onEdit, onUpdate, onChange, isEditing, type = "text" }: any) => {
  const activeField = editField === id;

  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2 pr-4" aria-disabled={isEditing}>
        <Input type={type} id={id} value={value} disabled={!activeField} onChange={(e) => onChange(e.target.value)} />
        {activeField ? (
          isEditing ? (
            <>
              <Circle className="h-5 w-5 ml-1 cursor-pointer text-blue-600" />
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 ml-1 cursor-pointer text-green-600" onClick={() => onUpdate(id)} />
              <X className="h-6 w-6 ml-1 cursor-pointer text-red-600" onClick={() => onEdit(null)} />
            </>
          )
        ) : (
          <Pencil className="h-5 w-5 ml-1 cursor-pointer" onClick={() => onEdit(id)} />
        )}
      </div>
    </div>
  );
};

export default Settings;
