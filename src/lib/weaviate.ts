import weaviate from "weaviate-ts-client";
import { prisma } from "@/lib/prisma";
import { saveUserVector } from "@/lib/actions/saveUserVector";

export const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

// weaviate에 User 클래스를 정의
const createUserSchema = async () => {
  await client.schema
    .classCreator()
    .withClass({
      class: "User",
      description: "User profile for investment-matching",
      vectorIndexType: "hnsw",
      moduleConfig: {},
      properties: [
        {
          name: "userId",
          dataType: ["number"],
          description: "user ID from main DB",
        },
        {
          name: "gender",
          dataType: ["string"],
          description: "user's own gender",
        },
        {
          name: "currentType",
          dataType: ["string"],
          description: "investment type: CONSERVATIVE ~ VERY_AGGRESSIVE",
        },
        {
          name: "preferredType",
          dataType: ["string"],
          description: "preferred investment type",
        },
        {
          name: "currentVector",
          dataType: ["number[]"],
          description: "numeric vector of current investment profile",
        },
      ],
      vectorizer: "none",
    })
    .do();
};

// 기존의 유저들을 Weaviate에 업로드
async function main() {
  const users = await prisma.user.findMany({});
  for (const user of users) {
    await saveUserVector(user);
  }
}

async function dropSchema() {
  await client.schema
    .classDeleter()
    .withClassName("User") // 삭제할 클래스명
    .do();

  console.log("🗑️ 'User' 클래스 삭제 완료");
}

if (require.main === module) {
  (async () => {
    await dropSchema();
    await createUserSchema();
    console.log("✅ User schema created in Weaviate");
    await main();
  })();
}
