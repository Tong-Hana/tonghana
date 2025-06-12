// TODO: 프로필 등록에 S3 이미지 업로드 연동
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const Bucket = process.env.AMPLIFY_BUCKET;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("img") as File;

    // 파일이 없거나 File 타입이 아닌 경우
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ message: "이미지 파일이 없습니다." }),
        {
          status: 400,
        },
      );
    }

    if (!Bucket || !process.env.AWS_REGION) {
      return new Response(
        JSON.stringify({ message: "환경 변수가 설정되지 않았습니다." }),
        {
          status: 500,
        },
      );
    }

    const fileExtension = file.name.split(".").pop();
    const Key = `${uuidv4()}.${fileExtension}`;
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

    const imgUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;

    return new Response(JSON.stringify({ data: imgUrl, message: "OK" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ message: "파일 업로드 중 오류가 발생했습니다." }),
      { status: 500 },
    );
  }
}
