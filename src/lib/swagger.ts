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
      tags: [
        {
          name: "Auth",
          description: "인증 및 로그인 관련 API",
        },
        {
          name: "Profiles",
          description: "사용자 프로필 관련 API",
        },
        {
          name: "MatchCards",
          description: "매칭 카드 조회 API",
        },
        {
          name: "MatchLikes",
          description: "좋아요 및 매칭 상태 관련 API",
        },
        {
          name: "Chat",
          description: "채팅 기능 관련 API",
        },
      ],
    },
  }) as OpenAPIV3.Document;
}
