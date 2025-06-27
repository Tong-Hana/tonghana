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

    // 3. 문항별 점수 맵
    const scoreMap: Record<number, Record<number, number>> = {
      1: { 1: 2.5, 2: 2.5, 3: 2.0, 4: 1.5, 5: 1.0, 6: 0.5 },
      2: { 1: 1.0, 2: 2.0, 3: 2.5, 4: 3.0, 5: 3.5 },
      3: { 1: 5.5, 2: 3.5, 3: 1.0 },
      4: { 1: 1.0, 2: 2.5, 3: 3.5, 4: 4.5, 5: 5.5 }, // 중복 응답 가능
      5: { 1: 5.5, 2: 4.0, 3: 2.5, 4: 1.0 },
      6: { 1: 1.0, 2: 2.0, 3: 3.0, 4: 4.0 },
      7: { 1: 10.0, 2: 8.5, 3: 6.0, 4: 3.0, 5: 1.0 },
      8: { 1: 2.5, 2: 2.0, 3: 1.5, 4: 1.0, 5: 0.5, 6: 2.5 },
    };

    // 4. 점수 합산
    let totalScore = 0;
    answers.forEach((answer, idx) => {
      const qn = idx + 1;

      if (qn === 4 && Array.isArray(answer)) {
        answer.forEach((choice) => {
          totalScore += scoreMap[qn][choice] || 0;
        });
      } else {
        totalScore += scoreMap[qn][answer] || 0;
      }
    });

    totalScore = totalScore / 39;
    totalScore = totalScore * 100;

    // 5. 투자 성향 분류
    let currentType:
      | "CONSERVATIVE"
      | "MODERATE"
      | "NEUTRAL"
      | "AGGRESSIVE"
      | "VERY_AGGRESSIVE";

    if ((answers[0] === 6 && answers[5] === 3) || answers[6] === 5)
      currentType = "CONSERVATIVE";
    else if (totalScore < 43) currentType = "CONSERVATIVE";
    else if (totalScore < 55) currentType = "MODERATE";
    else if (totalScore < 68) currentType = "NEUTRAL";
    else if (totalScore < 81) currentType = "AGGRESSIVE";
    else currentType = "VERY_AGGRESSIVE";

    // 6. DB 저장
    const updateUser = await masterPrisma.user.update({
      where: { userId: user.userId },
      data: {
        currentType,
      },
    });

    // 7. Weaviate 벡터 저장
    await updateUserCurrentVector(updateUser);

    return NextResponse.json({
      message: "투자 성향 분석 결과가 성공적으로 저장되었습니다.",
      resultType: currentType,
      totalScore,
    });
  } catch (err) {
    console.error("❌ 투자 성향 API 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
