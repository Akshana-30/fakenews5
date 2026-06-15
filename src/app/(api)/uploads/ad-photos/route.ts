import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
    const formData = await request.formData();
    const files = formData.getAll("photos") as File[];

    if (files.length === 0) {
        return NextResponse.json({ urls: [] });
    }

    for (const file of files) {
        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
        }
        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json({ error: `File "${file.name}" exceeds the 5 MB limit.` }, { status: 400 });
        }
    }

    const folderName = randomUUID();
    const uploadDir = path.join(process.cwd(), "public", "uploads", "ads", folderName);
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const filename = `${randomUUID()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadDir, filename), buffer);
        urls.push(`/uploads/ads/${folderName}/${filename}`);
    }

    return NextResponse.json({ urls });
}
