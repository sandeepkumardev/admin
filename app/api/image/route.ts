import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

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

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json({ ok: false, error: data.error });
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ ok: false, error: "Failed to upload" });
  }
}

export async function DELETE(req: NextApiRequest) {
  const reqUrl = new URL(req.url || "");
  const searchParams = Object.fromEntries(reqUrl.searchParams.entries());

  const { public_ids } = searchParams;

  if (!public_ids) {
    return NextResponse.json({ error: "public_ids is required" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  try {
    const response = await fetch(`${url}?public_ids=${public_ids}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({
        ok: true,
        data: "file deleted",
      });
    } else {
      const error = await response.json();
      return NextResponse.json({ ok: false, error: error?.error?.message || "Something went wrong" });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Failed to delete image" });
  }
}
