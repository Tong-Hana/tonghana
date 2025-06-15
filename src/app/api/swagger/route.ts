import { NextResponse } from "next/server";
import { createSwaggerSpec } from "next-swagger-doc";

export async function GET() {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "My Next.js App Router API",
        version: "1.0.0",
      },
    },
  });

  return NextResponse.json(spec);
}
