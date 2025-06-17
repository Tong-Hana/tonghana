import { createSwaggerSpec } from "next-swagger-doc";
import type { OpenAPIV3 } from "openapi-types";

export function getSwaggerSpec(): OpenAPIV3.Document {
  return createSwaggerSpec({
    apiFolder: "src/app/api", // ← 실제 API 핸들러 경로
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Docs",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  }) as OpenAPIV3.Document;
}
