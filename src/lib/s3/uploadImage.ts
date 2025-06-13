// lib/s3/uploadImage.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const Bucket = process.env.AMPLIFY_BUCKET!;

export async function uploadImageToS3(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const Key = `${uuidv4()}.${ext}`;
  const Body = Buffer.from(await file.arrayBuffer());
  const ContentType = file.type || "image/jpeg";

  await s3.send(
    new PutObjectCommand({
      Bucket,
      Key,
      Body,
      ContentType,
    }),
  );

  return `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
}
