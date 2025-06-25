// GET /api/subject
// 오늘의 주제 응답하는 API

/**
 * @swagger
 * /api/subject:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: 오늘의 주제 조회
 *     description: >
 *       오늘 날짜를 기준으로 정해진 퀴즈 주제를 반환합니다.
 *       인증된 사용자만 접근 가능합니다.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 오늘의 주제 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   type: object
 *                   properties:
 *                     subjectType:
 *                       type: string
 *                       example: "예금"
 *                     title:
 *                       type: string
 *                       example: "자유적금 상품"
 *                     description:
 *                       type: string
 *                       example: "매달 자유롭게 입금 가능한 적금 상품입니다."
 *                     features:
 *                       type: string
 *                       example: "월 100만원까지 납입 가능, 중도해지 가능"
 *                     period:
 *                       type: string
 *                       example: "12개월"
 *                     amount:
 *                       type: string
 *                       example: "최대 1,200만원"
 *                     interestRate:
 *                       type: string
 *                       example: "연 3.5%"
 *                     subjectUrl:
 *                       type: string
 *                       format: uri
 *                       example: "https://hana.com/product/123"
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 오늘의 주제 없음 또는 찾을 수 없음
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

    const subject = await replicaPrisma.subject.findUnique({
      where: { subjectId: todaySubjectId },
      select: {
        subjectType: true,
        title: true,
        description: true,
        features: true,
        period: true,
        amount: true,
        interestRate: true,
        subjectUrl: true,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { message: "오늘의 주제를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ subject }, { status: 200 });
  } catch (error) {
    console.error("오늘의 주제를 가져오지 못했습니다: ", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
