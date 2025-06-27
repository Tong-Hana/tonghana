/**
 * @swagger
 * /api/profiles:
 *   patch:
 *     tags:
 *       - Profiles
 *     summary: 사용자 프로필 등록 및 수정
 *     description: |
 *       회원가입 후후 사용자가 자신의 프로필 정보를 등록 및 수정합니다.
 *       한 줄 소개, 직업, 목표 설정, 목표 금액, 목표 기간,
 *       실물 자산 보유 현황(자차, 부동산) 및 시세 정보, 프로필 이미지를 포함합니다.
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
 *                 description: 업로드할 프로필 이미지 파일 (선택)
 *               description:
 *                 type: string
 *                 example: "안녕하세요!"
 *               job:
 *                 type: string
 *                 example: "백엔드 개발자"
 *               goalType:
 *                 type: string
 *                 enum: [HOUSE, LUMPSUM, RETIREMENT, MARRIAGE]
 *                 example: "HOUSE"
 *               goalAmount:
 *                 type: string
 *                 example: "50000000"
 *               goalPeriod:
 *                 type: string
 *                 enum: [WITHIN_1_YEAR, WITHIN_3_YEARS, WITHIN_5_YEARS, MORE_THAN_5_YEARS]
 *                 example: "WITHIN_3_YEARS"
 *               hasCar:
 *                 type: string
 *                 enum: ["true", "false"]
 *               carValue:
 *                 type: string
 *                 example: "12000000"
 *               hasHouse:
 *                 type: string
 *                 enum: ["true", "false"]
 *               houseValue:
 *                 type: string
 *                 example: "300000000"
 *     responses:
 *       200:
 *         description: 프로필 등록 성공
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
 *                       example: 204
 *                     nickname:
 *                       type: string
 *                       example: "테스트1"
 *                     profileImage:
 *                       type: string
 *                       format: uri
 *                       example: "https://tonghanabucket.s3.ap-northeast-2.amazonaws.com/example.jpeg"
 *                     description:
 *                       type: string
 *                       example: "안녕하세요!"
 *                     job:
 *                       type: string
 *                       example: "백엔드 개발자"
 *                     goalType:
 *                       type: string
 *                       example: "MARRIAGE"
 *                     goalPeriod:
 *                       type: string
 *                       example: "WITHIN_3_YEARS"
 *                     goalAmount:
 *                       type: string
 *                       example: "50000000"
 *                     hasCar:
 *                       type: boolean
 *                       example: true
 *                     carValue:
 *                       type: string
 *                       example: "12000000"
 *                     hasHouse:
 *                       type: boolean
 *                       example: false
 *                     houseValue:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않음
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { uploadImageToS3 } from "@/lib/s3/uploadImage";
import { GoalType, GoalPeriod } from "@prisma/client";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { Buffer } from "buffer";

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
  // if (file && file instanceof File) {
  //   try {
  //     profileImage = await uploadImageToS3(file);
  //   } catch (err) {
  //     console.error("❌ S3 업로드 실패:", err);
  //     return NextResponse.json(
  //       { code: "IMAGE_UPLOAD_FAILED", message: "이미지 업로드 실패" },
  //       { status: 500 },
  //     );
  //   }
  // }

  if (file && file instanceof File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      profileImage = await uploadImageToS3({
        name: file.name,
        buffer,
        type: file.type,
      });
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
    const updatedUser = await masterPrisma.user.update({
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
          userId: updatedUser.userId,
          nickname: updatedUser.nickname,
          profileImage: updatedUser.profileImage,
          description: updatedUser.description,
          job: updatedUser.job,
          goalType: updatedUser.goalType,
          goalPeriod: updatedUser.goalPeriod,
          goalAmount: updatedUser.goalAmount?.toString() ?? null,
          hasCar: updatedUser.hasCar,
          carValue: updatedUser.carValue?.toString() ?? null,
          hasHouse: updatedUser.hasHouse,
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
