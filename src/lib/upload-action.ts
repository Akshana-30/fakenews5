"use server";

import { randomUUID } from "crypto";
import { BUCKET, s3 } from "./s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export type UploadResult = { success: true; url: string } | { error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
        return { error: "Invalid file." };
    }

    if (!file.type.startsWith("image/")) {
        return { error: "File is not an image." };
    }

    if (file.size > 10 * 1024 * 1024) {
        return { error: "File size is exceeds 10MB limit." };
    }

    if (!BUCKET) {
        return { error: "No bucket configuration." };
    }

    const ext = file.name.split(".").pop();
    const key = `${randomUUID()}.${ext}`;
    const body = Buffer.from(await file.arrayBuffer());

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: body,
            ContentType: file.type,
        }),
    );

    const url = `${process.env.RUSTFS_ENDPOINT}/${BUCKET}/${key}`;

    await prisma.image.create({
        data: { name: key, url: url },
    });

    revalidatePath("/");
    return { success: true, url: url };
}
