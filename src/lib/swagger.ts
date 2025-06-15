// src/lib/swagger.ts
import { createSwaggerSpec } from "next-swagger-doc";
import type { OpenAPIV3 } from "openapi-types";

export function getSwaggerSpec(): OpenAPIV3.Document {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Docs",
        version: "1.0.0",
      },
    },
  }) as OpenAPIV3.Document; // ← 명시적으로 단언
}
