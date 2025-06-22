/**
 * @swagger
 * /api/quiz:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: 다음 퀴즈 주제를 조회합니다.
 *     responses:
 *       200:
 *         description: 퀴즈 주제 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todaySubject:
 *                   type: object
 *                   properties:
 *                     subjectId:
 *                       type: integer
 *                     subjectType:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     features:
 *                       type: string
 *                     amount:
 *                       type: string
 *                     interestRate:
 *                       type: string
 *                     subjectUrl:
 *                       type: string
 *                     quiz:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *                           explanation:
 *                             type: string
 *                           answer:
 *                             type: boolean
 *                       example:
 *                         - question: "하나의 정기예금은 계약기간과 가입금액 모두 자유롭게 설정할 수 있다."
 *                           explanation: "하나의 정기예금은 계약기간 및 가입금액이 자유로워요"
 *                           answer: true
 *                         - question: "하나의 정기예금은 최대 10년까지 가입기간을 정할 수 있다."
 *                           explanation: "하나의 정기예금은 1개월 이상 5년 이내 일단위로 가입기간을 정할 수 있어요"
 *                           answer: false
 *                         - question: "하나의 정기예금은 가입금액이 1백만원 이상이어야 한다."
 *                           explanation: "하나의 정기예금 가입금액은 최소 1백만원 부터 금액을 자유롭게 정할 수 있어요"
 *                           answer: true
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "UNAUTHORIZED"
 *                 message:
 *                   type: string
 *                   example: "인증되지 않았습니다."
 *       404:
 *         description: 더 이상 풀 퀴즈 주제가 없을 때
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "더 이상 퀴즈 주제가 없습니다."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "서버 오류"
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }
  try {
    const lastSubjectLog = await prisma.userQuizLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { subjectId: true },
    });

    const lastSubjectId = lastSubjectLog?.subjectId ?? 0;

    if (lastSubjectId === (await prisma.subject.count())) {
      return NextResponse.json(
        { code: "NO_MORE_SUBJECTS", message: "모든 퀴즈를 다 풀었습니다." },
        { status: 400 },
      );
    }

    const todaySubject = await prisma.subject.findFirst({
      where: { subjectId: lastSubjectId + 1 },
      select: {
        subjectId: true,
        subjectType: true,
        title: true,
        description: true,
        features: true,
        amount: true,
        interestRate: true,
        subjectUrl: true,
        quiz: {
          select: { question: true, explanation: true, answer: true },
        },
      },
    });

    return NextResponse.json({ todaySubject }, { status: 200 });
  } catch (error) {
    console.error("Error fetching random subject:", error);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR", message: "서버 오류" },
      { status: 500 },
    );
  }
}
