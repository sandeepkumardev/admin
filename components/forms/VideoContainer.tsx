import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

const VideoContainer = ({ video, setVideo }: { video: string; setVideo: (url: string) => void }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadVideo = async (file: File) => {
    console.log(file.size / 1024 / 1024);
    if (file.size / 1024 / 1024 > 100) {
      toast({
        title: "Error",
        description: "Video size should be less than 100MB",
      });
      setFile(null);
      setVideo("");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setVideo(data.data.secure_url);
      } else {
        toast({
          title: "Error",
          description: data.error || "Video upload failed",
        });
        setFile(null);
        setVideo("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Video upload failed",
      });
      setFile(null);
      setVideo("");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!file) return;

    handleUploadVideo(file);
  }, [file]);

  return (
    <div className="mt-3">
      <p className="text-sm text-muted-foreground">Product Video</p>
      <input
        id="video"
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="hidden"
      />

      {file || video ? (
        uploading ? (
          <p>uploading...</p>
        ) : (
          <div className="w-[200px]">
            <AspectRatio ratio={0.8 / 1}>
              <video controls className="w-full h-full">
                <source src={video} type="video/mp4" />
              </video>
            </AspectRatio>
          </div>
        )
      ) : (
        <Button
          variant="outline"
          className="flex items-center "
          // @ts-ignore
          onClick={() => fileInputRef.current.click()}
        >
          <span className="mr-2 text-xl mt-[-3px]">+</span> Add Video
        </Button>
      )}
    </div>
  );
};

export default VideoContainer;
