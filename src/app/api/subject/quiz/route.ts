// GET /api/subject/quiz
// 오늘의 주제에 대한 퀴즈를 응답하는 API

/**
 * @swagger
 * /api/subject/quiz:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: 오늘의 주제에 대한 퀴즈 조회
 *     description: >
 *       오늘의 주제에 해당하는 퀴즈 목록을 반환합니다.
 *       인증된 사용자만 접근할 수 있습니다.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 퀴즈 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quiz:
 *                   type: array
 *                   description: 퀴즈 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                         example: "예금은 만기 이전에 해지할 수 있다"
 *                       explanation:
 *                         type: string
 *                         example: "예금은 약정 기간이 지나야 이자를 제대로 받을 수 있습니다."
 *                       answer:
 *                         type: boolean
 *                         example: false
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 주제 없음 또는 퀴즈 없음
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

import { NextResponse } from "next/server";
import { getTodaySubjectId } from "@/lib/getTodaySubjectId";
import { replicaPrisma } from "@/lib/prisma/replicaClient";

export async function GET() {
  try {
    const todaySubjectId = await getTodaySubjectId();
    if (!todaySubjectId) {
      return NextResponse.json(
        { message: "오늘의 주제가 없습니다." },
        { status: 404 },
      );
    }

    const quiz = await replicaPrisma.quiz.findMany({
      where: { subjectId: todaySubjectId },
      select: {
        question: true,
        explanation: true,
        answer: true,
      },
    });

    if (quiz.length === 0) {
      return NextResponse.json(
        { message: `${todaySubjectId} 에 대한 퀴즈가 없습니다.` },
        { status: 404 },
      );
    }

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    console.error("오늘의 퀴즈를 가져오지 못했습니다.: ", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
