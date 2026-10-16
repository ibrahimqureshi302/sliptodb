import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse uploaded file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    // 5. Build unique storage path
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const filePath = `${user.id}/${timestamp}-${random}.pdf`;

    // 6. Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("invoice-uploads")
      .upload(filePath, arrayBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload] Storage error:", uploadError);
      return NextResponse.json(
        { error: `Failed to save file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 7. Insert into upload_queue
    const { data: queueRow, error: queueError } = await supabase
      .from("upload_queue")
      .insert({
        customer_id: user.id,
        file_path: filePath,
        file_name: file.name,
        status: "pending",
      })
      .select("id")
      .single();

    if (queueError) {
      console.error("[upload] Queue error:", queueError);

      // Cleanup: delete the uploaded file since we couldn't queue it
      await supabase.storage.from("invoice-uploads").remove([filePath]);

      return NextResponse.json(
        { error: `Failed to queue file: ${queueError.message}` },
        { status: 500 }
      );
    }

    // 8. Success response
    return NextResponse.json({
      success: true,
      queue_id: queueRow.id,
      file_name: file.name,
      file_path: filePath,
      message: "File uploaded and queued for processing",
    });
  } catch (err) {
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
