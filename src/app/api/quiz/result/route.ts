/**
 * @swagger
 * /api/quiz/result:
 *   post:
 *     tags:
 *       - Quiz
 *     summary: 퀴즈 결과 제출 및 정답 검증 후 로그 생성
 *     description: >
 *       사용자가 제출한 퀴즈 답안을 정답과 비교하여 모두 맞았으면 통과 로그를 생성하고,
 *       하나라도 틀렸으면 실패 로그를 생성합니다.
 *       인증된 사용자만 접근 가능합니다.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjectId:
 *                 type: integer
 *                 example: 1
 *                 description: 퀴즈 주제 ID
 *               quizAnswers:
 *                 type: array
 *                 description: 퀴즈 정답 배열 (boolean 값들)
 *                 items:
 *                   type: boolean
 *                 example: [true, false, true]
 *             required:
 *               - subjectId
 *               - quizAnswers
 *     responses:
 *       201:
 *         description: 퀴즈 결과 로그 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "true 로그가 생성되었습니다."
 *       400:
 *         description: 잘못된 요청 (필수 파라미터 누락 또는 형식 오류)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 존재하지 않는 주제 ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  try {
    const { subjectId, quizAnswers } = await req.json();

    if (!subjectId || !quizAnswers || !Array.isArray(quizAnswers)) {
      return NextResponse.json(
        { code: "INVALID_REQUEST", message: "잘못된 요청입니다." },
        { status: 400 },
      );
    }

    if (subjectId > (await prisma.subject.count())) {
      return NextResponse.json(
        { message: "존재하지 않는 주제입니다." },
        { status: 404 },
      );
    }

    const quizzes = await prisma.quiz.findMany({
      where: { subjectId },
      orderBy: { quizId: "asc" },
      select: { answer: true },
    });

    const isPassed = quizzes.every(
      (quiz, index) => quiz.answer === quizAnswers[index],
    );

    await prisma.userQuizLog.create({
      data: {
        userId: user.userId,
        subjectId: subjectId,
        isPassed: isPassed,
      },
    });

    return NextResponse.json(
      { message: `${isPassed} 로그가 생성되었습니다.` },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing quiz result:", error);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR", message: "서버 오류" },
      { status: 500 },
    );
  }
}
