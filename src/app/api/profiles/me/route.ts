/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: 내 정보 조회 (마이페이지)
 *     description: 사용자 기본 정보, 지난달 소비 내역, 가입한 금융상품 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 186
 *                 nickname:
 *                   type: string
 *                   example: "성수 카리나"
 *                 consumeHistory:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 186
 *                     savingsRate:
 *                       type: string
 *                       example: "9"
 *                     investmentRate:
 *                       type: string
 *                       example: "15"
 *                     leisureRate:
 *                       type: string
 *                       example: "36"
 *                     livingExpenseRate:
 *                       type: string
 *                       example: "16"
 *                     otherRate:
 *                       type: string
 *                       example: "40"
 *                 userFinancialProduct:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userProductId:
 *                         type: integer
 *                         example: 1297
 *                       userId:
 *                         type: integer
 *                         example: 186
 *                       productId:
 *                         type: integer
 *                         example: 73
 *                       currentValue:
 *                         type: string
 *                         example: "6000000"
 *                       productEndDate:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2028-02-16T16:31:25.447Z"
 *                       financialProduct:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: integer
 *                             example: 73
 *                           productName:
 *                             type: string
 *                             example: "기업은행 자유적립 적금"
 *                           institutionName:
 *                             type: string
 *                             example: "기업은행"
 *                           riskLevel:
 *                             type: string
 *                             example: "VERY_LOW"
 *                           category:
 *                             type: string
 *                             example: "SAVINGS"
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *
 *   patch:
 *     tags:
 *       - Profiles
 *     summary: 내 정보 수정 (마이페이지)
 *     description: 마이페이지에서 사용자 프로필 정보 및 페어링북 답변을 일부 혹은 전체 수정합니다.
 *                  multipart/form-data 방식으로 이미지와 데이터를 함께 전송합니다.
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
 *                 description: 프로필 이미지 파일
 *               nickname:
 *                 type: string
 *                 example: "성수 카리나"
 *               description:
 *                 type: string
 *                 example: "성수 살아요."
 *               job:
 *                 type: string
 *                 example: "백엔드 개발자"
 *               goalAmount:
 *                 type: string
 *                 example: "50000000"
 *               goalType:
 *                 type: string
 *                 enum: [HOUSE, LUMPSUM, RETIREMENT, MARRIAGE]
 *                 example: "MARRIAGE"
 *               goalPeriod:
 *                 type: string
 *                 enum: [WITHIN_1_YEAR, WITHIN_3_YEARS, WITHIN_5_YEARS, MORE_THAN_5_YEARS]
 *                 example: "WITHIN_3_YEARS"
 *               hasCar:
 *                 type: string
 *                 enum: [true, false]
 *                 example: "true"
 *               carValue:
 *                 type: string
 *                 example: "15000000"
 *               hasHouse:
 *                 type: string
 *                 enum: [true, false]
 *                 example: "false"
 *               houseValue:
 *                 type: string
 *                 example: "0"
 *               city:
 *                 type: string
 *                 example: "서울시 성동구"
 *               pairingAnswer:
 *                 type: string
 *                 description: |
 *                   JSON 문자열 예시:
 *                   {"carBudget":"1000000","preferredCity":"서울시 강남구"}
 *                 example: '{"carBudget":"15000000","preferredCity":"서울시 강남구"}'
 *     responses:
 *       200:
 *         description: 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "수정 완료"
 *       400:
 *         description: 잘못된 입력값
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { uploadImageToS3 } from "@/lib/s3/uploadImage";
import { Buffer } from "buffer";

// 내 정보 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const profile = await replicaPrisma.user.findUnique({
      where: { userId: user.userId },
      select: {
        userId: true,
        nickname: true,
        consumeHistory: {
          select: {
            userId: true,
            savingsRate: true,
            investmentRate: true,
            leisureRate: true,
            livingExpenseRate: true,
            otherRate: true,
          },
        },
        userFinancialProduct: {
          select: {
            userProductId: true,
            userId: true,
            productId: true,
            currentValue: true,
            productEndDate: true,
            financialProduct: {
              select: {
                productId: true,
                productName: true,
                institutionName: true,
                riskLevel: true,
                category: true,
              },
            },
          },
        },
      },
    });

    const serializedProfile = {
      ...profile,
      userFinancialProduct: profile?.userFinancialProduct?.map((p) => ({
        ...p,
        currentValue: p.currentValue.toString(), // BigInt → String
        productEndDate: p.productEndDate,
        financialProduct: p.financialProduct,
      })),
    };

    return NextResponse.json(serializedProfile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// 마이페이지에서 내 정보 수정
export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("img");
  let profileImage: string | null = null;

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

  // 텍스트 값 추출
  const nickname = formData.get("nickname");
  const job = formData.get("job");
  const goalAmount = formData.get("goalAmount");
  const goalPeriod = formData.get("goalPeriod");
  const goalType = formData.get("goalType");
  const description = formData.get("description");
  const hasCar = formData.get("hasCar");
  const carValue = formData.get("carValue");
  const hasHouse = formData.get("hasHouse");
  const houseValue = formData.get("houseValue");
  const city = formData.get("city");
  const pairingAnswerRaw = formData.get("pairingAnswer");

  // enum 검증
  const validGoalTypes = ["HOUSE", "LUMPSUM", "RETIREMENT", "MARRIAGE"];
  const validGoalPeriods = [
    "WITHIN_1_YEAR",
    "WITHIN_3_YEARS",
    "WITHIN_5_YEARS",
    "MORE_THAN_5_YEARS",
  ];

  if (goalType && !validGoalTypes.includes(goalType.toString())) {
    return NextResponse.json(
      { code: "INVALID_GOAL_TYPE", message: "목표 타입이 유효하지 않습니다." },
      { status: 400 },
    );
  }

  if (goalPeriod && !validGoalPeriods.includes(goalPeriod.toString())) {
    return NextResponse.json(
      {
        code: "INVALID_GOAL_PERIOD",
        message: "목표 기간이 유효하지 않습니다.",
      },
      { status: 400 },
    );
  }

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

  const updateData: any = {
    ...(nickname && { nickname: nickname.toString() }),
    ...(job && { job: job.toString() }),
    ...(goalAmount && { goalAmount: BigInt(goalAmount.toString()) }),
    ...(goalPeriod && { goalPeriod: goalPeriod.toString() }),
    ...(goalType && { goalType: goalType.toString() }),
    ...(description && { description: description.toString() }),
    ...(profileImage && { profileImage }),
    ...(hasCar !== null && { hasCar: parsedHasCar }),
    ...(carValue !== null && { carValue: parsedCarValue }),
    ...(hasHouse !== null && { hasHouse: parsedHasHouse }),
    ...(houseValue !== null && { houseValue: parsedHouseValue }),
    ...(city && { city: city.toString() }),
  };

  try {
    await masterPrisma.user.update({
      where: { userId: user.userId },
      data: updateData,
    });

    if (pairingAnswerRaw && typeof pairingAnswerRaw === "string") {
      const pairingAnswer = JSON.parse(pairingAnswerRaw);

      await masterPrisma.pairingAnswer.update({
        where: { userId: user.userId },
        data: {
          ...(pairingAnswer.carBudget !== undefined && {
            carBudget: BigInt(pairingAnswer.carBudget),
          }),
          ...(pairingAnswer.dateBudget !== undefined && {
            dateBudget: pairingAnswer.dateBudget,
          }),
          ...(pairingAnswer.shoesBudget !== undefined && {
            shoesBudget: pairingAnswer.shoesBudget,
          }),
          ...(pairingAnswer.preferredCity && {
            preferredCity: pairingAnswer.preferredCity,
          }),
          ...(pairingAnswer.idealIncomeRange && {
            idealIncomeRange: pairingAnswer.idealIncomeRange,
          }),
        },
      });
    }

    return NextResponse.json({ message: "수정 완료" }, { status: 200 });
  } catch (err) {
    console.error("❌ 프로필 수정 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
