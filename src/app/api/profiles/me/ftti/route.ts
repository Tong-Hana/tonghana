/**
 * @swagger
 * /api/profiles/me/ftti:
 *   post:
 *     tags:
 *       - Profiles
 *     summary: 투자 성향 분석 결과 저장
 *     description: 8개의 응답값을 기반으로 투자 성향을 분석하고 해당 유저의 currentType 필드를 업데이트합니다. 4번 문항은 복수 응답이 가능하며, 각 응답은 번호로 전달됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 description: 총 8개의 응답값을 담는 배열. 각 항목은 선택 번호를 나타내며, 4번 문항(배열 위치 index 3)은 중복 응답이 가능하므로 배열로 전달해야 합니다.
 *                 items:
 *                   oneOf:
 *                     - type: integer
 *                     - type: array
 *                       items:
 *                         type: integer
 *                 example: [3, 4, 3, [1, 2], 1, 3, 4, 6]
 *     responses:
 *       200:
 *         description: 투자 성향 분석 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "투자 성향 분석 결과가 성공적으로 저장되었습니다."
 *                 resultType:
 *                   type: string
 *                   enum: [CONSERVATIVE, MODERATE, NEUTRAL, AGGRESSIVE, VERY_AGGRESSIVE]
 *                   example: "NEUTRAL"
 *                 totalScore:
 *                   type: number
 *                   example: 57.5
 *       400:
 *         description: 잘못된 요청 (answers 길이 오류 등)
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { updateUserCurrentVector } from "@/lib/actions/saveUserVector";
import { calculateFttiScore } from "@/utils/calculateFttiScore";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    // 1. 유효성 검사 (총 8문항: 1~8, 4번은 배열 가능)
    if (!Array.isArray(answers) || answers.length !== 8) {
      return NextResponse.json(
        { error: "잘못된 응답 형식입니다." },
        { status: 400 },
      );
    }

    // 2. 로그인 유저 확인
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    // 3. 투자 성향 분류
    const { totalScore, resultType } = calculateFttiScore(answers);

    // 4. DB 저장
    const updateUser = await masterPrisma.user.update({
      where: { userId: user.userId },
      data: { currentType: resultType },
    });

    // 5. Weaviate 벡터 저장
    await updateUserCurrentVector(updateUser);

    return NextResponse.json({
      message: "투자 성향 분석 결과가 성공적으로 저장되었습니다.",
      resultType,
      totalScore,
    });
  } catch (err) {
    console.error("❌ 투자 성향 API 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
