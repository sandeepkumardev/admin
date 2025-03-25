import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    if (!formData) {
      return NextResponse.json({ error: "File data not found" });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";

    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json({ ok: false, error: data.error });
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Failed to upload" });
  }
}
