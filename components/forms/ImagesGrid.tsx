import { Input } from "@/components/ui/input";
import Image from "next/legacy/image";
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { RxCrossCircled } from "react-icons/rx";
import { IImageFile } from "@/types";

interface Props {
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  color: string;
}

const ImagesGrid = ({ files, setFiles, color }: Props) => {
  const existingFiles = files;
  const [loading, setLoading] = useState<{ id?: string; action?: string }>({});

  const uploadImage = async (file: File, id: string): Promise<{ data: IImageFile[]; exists: boolean }> => {
    if (!file.type.includes("image")) return { data: [], exists: false };
    setLoading({ id: id, action: "uploading" });

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/image", { method: "POST", body: formData });
    const res = await response.json();
    if (!res.ok) {
      toast({
        title: "Error",
        description: "File upload failed",
        variant: "destructive",
      });
      setLoading({});
      return { data: [], exists: false };
    }

    const fileURL = res.data.url;
    const public_id = res.data.public_id;

    const blob = URL.createObjectURL(file);

    const existingFileIndex = files.findIndex((f) => f.key === id);
    if (existingFileIndex !== -1) {
      const oldImgPublicId = existingFiles[existingFileIndex].publicId;
      // deleting the old image from cloudinary
      await fetch(`/api/image?public_ids=${oldImgPublicId}`, { method: "DELETE" });

      const data = files.map((f) => (f.key === id ? { key: id, color, blob: blob, url: fileURL, publicId: public_id } : f));
      setLoading({});
      return { data, exists: true };
    } else {
      const data = [{ key: id, color, blob: blob, url: fileURL, publicId: public_id }];
      setLoading({});
      return { data, exists: false };
    }
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { files, id } = e.target;
    if (!files || files.length === 0) return;
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    try {
      let newFiles: IImageFile[] = [];
      const colorHex = id.split("-")[1];

      if (files.length === 1) {
        // Single file upload
        const file = files[0];
        const { data, exists } = await uploadImage(file, id);
        if (exists) setFiles(data);
        else if (data.length) setFiles([...existingFiles, data[0]]);
      } else {
        // Multiple files upload
        const availableFiles = existingFiles.filter((f) => f.color === colorHex).map((f) => f.key.split("-")[0]);
        const availableUploads: string[] = ["image1", "image2", "image3", "image4", "image5"].filter(
          (key) => !availableFiles.includes(key)
        );

        if (availableUploads.length === 0) {
          toast({
            title: "Error",
            description: "All images already uploaded",
            variant: "destructive",
          });
          return;
        }

        const uploadPromises = availableUploads.map((key, index) => {
          const file = files[index];
          if (!file) return;
          return uploadImage(file, `${key}-${colorHex}`);
        });

        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach((result) => {
          if (result) newFiles.push(result.data[0]);
        });

        setFiles([...existingFiles, ...newFiles]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during the upload",
        variant: "destructive",
      });
    }
  };

  const removeImage = async (label: string) => {
    setLoading({ id: label, action: "deleting" });
    const publicId = files.find((f) => f.key === label)?.publicId || "";
    await fetch(`/api/image?public_ids=${publicId}`, { method: "DELETE" });
    const filterdFiles = files.filter((f) => f.key !== label);
    setFiles(filterdFiles);
    setLoading({});
  };

  return (
    <div className="flex gap-3 px-2">
      {["image1", "image2", "image3", "image4", "image5"].map((label) => (
        <ImageBox
          key={label}
          files={files}
          handleImage={handleImage}
          removeImage={removeImage}
          label={label}
          loading={loading}
          color={color}
        />
      ))}
    </div>
  );
};

const ImageBox = ({
  label,
  files,
  handleImage,
  removeImage,
  loading,
  color,
}: {
  label: string;
  files: IImageFile[];
  handleImage: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (label: string) => void;
  loading: { id?: string; action?: string };
  color: string;
}) => {
  const labelWithColor = label + "-" + color;
  const i = files.findIndex((f) => f.key === labelWithColor);
  return (
    <div className="flex flex-col gap-1 items-center pb-3">
      <div className="border w-24 h-24">
        <Label htmlFor={labelWithColor} className="cursor-pointer h-full flex items-center justify-center overflow-hidden">
          {files[i]?.blob || files[i]?.url ? (
            <Image
              src={files[i]?.blob || files[i]?.url}
              alt="image"
              width={96}
              height={96}
              priority
              className="object-cover"
            />
          ) : (
            <Image src={"/assets/fallback.jpg"} alt="image" width={96} height={96} priority className="object-cover" />
          )}
        </Label>

        <Input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id={labelWithColor}
          onChange={(e) => handleImage(e)}
        />
      </div>
      <div className="flex justify-around w-full items-center">
        {loading?.id === labelWithColor ? (
          <p className="text-sm">{loading?.action === "uploading" ? "Uploading..." : "Deleting..."}</p>
        ) : (
          <>
            <p className="text-sm">{label.slice(0, 1).toUpperCase() + label.slice(1)}</p>
            {i !== -1 && (
              <RxCrossCircled className="text-red-700 cursor-pointer" onClick={() => removeImage(labelWithColor)} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesGrid;
