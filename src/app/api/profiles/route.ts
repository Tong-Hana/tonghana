/**
 * @swagger
 * /api/profiles:
 *   patch:
 *     summary: 사용자 프로필 등록 또는 수정
 *     description: 사용자 인증 후 프로필 정보를 업데이트합니다. 이미지, 목표, 직업 등 다양한 정보를 포함합니다.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *               description:
 *                 type: string
 *                 example: "나는 개발자입니다."
 *               job:
 *                 type: string
 *                 example: "프론트엔드 엔지니어"
 *               goalType:
 *                 type: string
 *                 enum: [HOUSE, LUMPSUM, RETIREMENT, MARRIAGE]
 *                 example: "HOUSE"
 *               goalAmount:
 *                 type: string
 *                 example: "100000000"
 *               goalPeriod:
 *                 type: string
 *                 enum: [WITHIN_1_YEAR, WITHIN_3_YEARS, WITHIN_5_YEARS, MORE_THAN_5_YEARS]
 *                 example: "WITHIN_3_YEARS"
 *               hasCar:
 *                 type: string
 *                 enum: ["true", "false"]
 *               carValue:
 *                 type: string
 *                 example: "30000000"
 *               hasHouse:
 *                 type: string
 *                 enum: ["true", "false"]
 *               houseValue:
 *                 type: string
 *                 example: "500000000"
 *     responses:
 *       200:
 *         description: 프로필 등록 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "프로필 등록 완료이 완료되었습니다."
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     description:
 *                       type: string
 *                     job:
 *                       type: string
 *                     goalType:
 *                       type: string
 *                     goalPeriod:
 *                       type: string
 *                     goalAmount:
 *                       type: string
 *                     hasCar:
 *                       type: boolean
 *                     carValue:
 *                       type: string
 *                     hasHouse:
 *                       type: boolean
 *                     houseValue:
 *                       type: string
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */

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

  // 이미지 업로드
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

  // 타입 안전한 텍스트 추출 + 검증
  const description = formData.get("description");
  const job = formData.get("job");
  const goalType = formData.get("goalType");
  const goalAmount = formData.get("goalAmount");
  const goalPeriod = formData.get("goalPeriod");
  const hasCar = formData.get("hasCar");
  const carValue = formData.get("carValue");
  const hasHouse = formData.get("hasHouse");
  const houseValue = formData.get("houseValue");

  // 기본 타입 검증
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

  // enum 값 검증
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

  // Boolean 및 BigInt 처리
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
