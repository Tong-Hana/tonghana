import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { uploadImageToS3 } from "@/lib/s3/uploadImage";
import { GoalType, GoalPeriod } from "@prisma/client";

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("img");
  let profileImage: string | null = null;

  // ✅ 이미지 업로드
  if (file && file instanceof File) {
    try {
      profileImage = await uploadImageToS3(file);
    } catch (err) {
      console.error("❌ S3 업로드 실패:", err);
      return NextResponse.json(
        { code: "IMAGE_UPLOAD_FAILED", message: "이미지 업로드 실패" },
        { status: 500 },
      );
    }
  }

  // ✅ 타입 안전한 텍스트 추출 + 검증
  const description = formData.get("description");
  const job = formData.get("job");
  const goalType = formData.get("goalType");
  const goalAmount = formData.get("goalAmount");
  const goalPeriod = formData.get("goalPeriod");
  const hasCar = formData.get("hasCar");
  const carValue = formData.get("carValue");
  const hasHouse = formData.get("hasHouse");
  const houseValue = formData.get("houseValue");

  // ✅ 기본 타입 검증
  if (
    typeof description !== "string" ||
    typeof job !== "string" ||
    typeof goalType !== "string" ||
    typeof goalAmount !== "string" ||
    typeof goalPeriod !== "string"
  ) {
    return NextResponse.json(
      { code: "INVALID_INPUT", message: "입력값이 잘못되었습니다." },
      { status: 400 },
    );
  }

  // ✅ enum 값 검증
  const validGoalTypes = ["HOUSE", "LUMPSUM", "RETIREMENT", "MARRIAGE"];
  const validGoalPeriods = [
    "WITHIN_1_YEAR",
    "WITHIN_3_YEARS",
    "WITHIN_5_YEARS",
    "MORE_THAN_5_YEARS",
  ];

  if (
    !validGoalTypes.includes(goalType) ||
    !validGoalPeriods.includes(goalPeriod)
  ) {
    return NextResponse.json(
      {
        code: "INVALID_GOAL_INPUT",
        message: "목표 관련 입력값이 유효하지 않습니다.",
      },
      { status: 400 },
    );
  }

  // ✅ Boolean 및 BigInt 처리
  const parsedHasCar = hasCar === "true";
  const parsedCarValue =
    parsedHasCar && typeof carValue === "string" && carValue !== ""
      ? BigInt(carValue)
      : null;

  const parsedHasHouse = hasHouse === "true";
  const parsedHouseValue =
    parsedHasHouse && typeof houseValue === "string" && houseValue !== ""
      ? BigInt(houseValue)
      : null;

  try {
    const updatedUser = await prisma.user.update({
      where: { userId: user.userId },
      data: {
        profileImage,
        description,
        job,
        goalType: goalType as GoalType,
        goalPeriod: goalPeriod as GoalPeriod,
        goalAmount: BigInt(goalAmount),
        hasCar: parsedHasCar,
        carValue: parsedCarValue,
        hasHouse: parsedHasHouse,
        houseValue: parsedHouseValue,
      },
    });

    return NextResponse.json(
      {
        message: "프로필 등록 완료이 완료되었습니다.",
        user: {
          ...updatedUser,
          goalAmount: updatedUser.goalAmount?.toString() ?? null,
          carValue: updatedUser.carValue?.toString() ?? null,
          houseValue: updatedUser.houseValue?.toString() ?? null,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ 프로필 업데이트 실패:", err);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR", message: "서버 오류" },
      { status: 500 },
    );
  }
}
