import { createSwaggerSpec } from "next-swagger-doc";
import type { OpenAPIV3 } from "openapi-types";

export function getSwaggerSpec(): OpenAPIV3.Document {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Tonghana API Docs",
        version: "1.0",
        description: "JWT 인증이 필요한 API입니다.",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT를 사용한 Bearer 인증입니다. 예: Bearer {token}",
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
