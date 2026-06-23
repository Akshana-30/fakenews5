import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: process.env.RUSTFS_ENDPOINT,
    region: process.env.RUSTFS_REGION,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY!,
        secretAccessKey: process.env.RUSTFS_SECRET_KEY!,
    },
});

export const BUCKET = process.env.RUSTFS_BUCKET;
