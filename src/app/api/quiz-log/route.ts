// GET api/quiz-log
// POST api/quiz-log
// 퀴즈 로그를 반환하는 GET API와 퀴즈 로그를 생성하는 POST API

/**
 * @swagger
 * /api/quiz-log:
 *   get:
 *     tags:
 *       - Quiz
 *     summary: 오늘의 퀴즈 로그 조회
 *     description: >
 *       인증된 사용자의 오늘 퀴즈 결과를 조회합니다.
 *       이미 푼 경우 통과 여부를 반환하고, 오늘 풀었다면 `isPassed: null`을 반환합니다.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 퀴즈 결과 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isPassed:
 *                   type: boolean
 *                   nullable: true
 *                   description: 오늘 퀴즈 통과 여부 (null이면 아직 안 풀었음)
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 오늘의 주제가 없음
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
 *
 *   post:
 *     tags:
 *       - Quiz
 *     summary: 오늘의 퀴즈 결과 제출
 *     description: >
 *       오늘의 퀴즈에 대한 사용자 답안을 제출하고,
 *       정답과 비교하여 결과 로그를 생성합니다.
 *       오늘 이미 제출한 경우 중복 제출로 간주됩니다.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: boolean
 *                 example: true
 *                 description: 오늘의 퀴즈에 대한 사용자의 답변
 *             required:
 *               - answer
 *     responses:
 *       201:
 *         description: 퀴즈 로그 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isPassed:
 *                   type: boolean
 *                   description: 퀴즈 통과 여부
 *       400:
 *         description: 잘못된 요청 (퀴즈 개수와 답변 수 불일치 등)
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
 *         description: 오늘의 주제 또는 퀴즈가 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 이미 퀴즈를 푼 경우
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
 *   patch:
 *     tags:
 *       - Quiz
 *     summary: 오늘의 퀴즈 결과 수정
 *     description: >
 *       인증된 사용자가 오늘 제출한 퀴즈 결과를 수정합니다.
 *       이미 제출한 로그가 없으면 404 에러를 반환합니다.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: boolean
 *                 example: false
 *                 description: 수정할 퀴즈 답변 (정답 여부)
 *             required:
 *               - answer
 *     responses:
 *       201:
 *         description: 퀴즈 로그 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isPassed:
 *                   type: boolean
 *                   description: 수정된 퀴즈 통과 여부
 *       400:
 *         description: 잘못된 요청 (answer 누락 등)
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
 *         description: 오늘 퀴즈 로그가 없음
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
import { getAuthUser } from "@/lib/auth";
import { getTodaySubjectId } from "@/lib/getTodaySubjectId";
import { isSameDay } from "date-fns";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { makeMatchPartner } from "@/lib/actions/makeMatchPartner";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }

  try {
    const todaySubjectId = await getTodaySubjectId();
    if (!todaySubjectId) {
      return NextResponse.json(
        { message: "오늘의 주제가 없습니다." },
        { status: 404 },
      );
    }

    const existingLog = await replicaPrisma.userQuizLog.findFirst({
      where: { subjectId: todaySubjectId, userId: user.userId },
      select: {
        isPassed: true,
        createdAt: true,
      },
    });

    // 유저 로그가 있으면, 오늘 퀴즈를 풀었는지 확인
    if (existingLog) {
      // 오늘 퀴즈를 풀었는지 확인
      const isToday = isSameDay(existingLog.createdAt, new Date());
      if (isToday) {
        return NextResponse.json(
          { isPassed: existingLog.isPassed },
          { status: 200 },
        );
      }
    }

    // 유저 로그가 없거나 오늘 퀴즈를 풀지 않은 경우
    return NextResponse.json({ isPassed: null }, { status: 200 });
  } catch (error) {
    console.error("퀴즈 로그를 가져오지 못했습니다: ", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// 퀴즈 로그 생성 전에 createdAt 확인해서 오늘 푼게 아니라면 다시 풀어서 로그 새로 생성
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }

  try {
    const todaySubjectId = await getTodaySubjectId();
    if (!todaySubjectId) {
      return NextResponse.json(
        { message: "오늘의 주제가 없습니다." },
        { status: 404 },
      );
    }

    const existingLog = await replicaPrisma.userQuizLog.findFirst({
      where: { subjectId: todaySubjectId, userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
      },
    });

    // 유저 로그가 있으면, 오늘 퀴즈를 풀었는지 확인
    if (existingLog) {
      const isToday = isSameDay(existingLog.createdAt, new Date());
      if (isToday) {
        return NextResponse.json(
          { message: "오늘 퀴즈는 이미 풀었습니다." },
          { status: 409 },
        );
      }
    }

    const quizzes = await replicaPrisma.quiz.findMany({
      where: { subjectId: todaySubjectId },
      orderBy: { quizId: "asc" },
      select: { answer: true },
    });

    if (quizzes.length === 0) {
      return NextResponse.json(
        { message: `${todaySubjectId} 에 대한 퀴즈가 없습니다.` },
        { status: 404 },
      );
    }

    // 요청에서 answer가 있는지 확인
    const { answer } = await req.json();
    if (answer === undefined || answer === null) {
      return NextResponse.json(
        { message: "퀴즈 답변이 필요합니다." },
        { status: 400 },
      );
    }

    const newQuizLog = await masterPrisma.userQuizLog.create({
      data: {
        userId: user.userId,
        subjectId: todaySubjectId,
        isPassed: Boolean(answer),
      },
    });

    return NextResponse.json(
      { isPassed: newQuizLog.isPassed },
      { status: 201 },
    );
  } catch (error) {
    console.error("퀴즈 로그를 생성하지 못했습니다: ", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }

  // 요청에서 answer가 있는지 확인
  const { answer } = await req.json();
  if (answer === undefined || answer === null) {
    return NextResponse.json(
      { message: "퀴즈 답변이 필요합니다." },
      { status: 400 },
    );
  }

  try {
    const todaySubjectId = await getTodaySubjectId();
    if (!todaySubjectId) {
      return NextResponse.json(
        { message: "오늘의 주제가 없습니다." },
        { status: 404 },
      );
    }

    const existingLog = await replicaPrisma.userQuizLog.findFirst({
      where: { subjectId: todaySubjectId, userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        quizLogId: true,
      },
    });

    if (existingLog === null) {
      return NextResponse.json(
        { message: "오늘 퀴즈를 풀지 않았습니다." },
        { status: 404 },
      );
    }

    const newQuizLog = await masterPrisma.userQuizLog.update({
      where: {
        quizLogId: existingLog.quizLogId,
      },
      data: {
        isPassed: Boolean(answer),
      },
    });
    const baseUser = await replicaPrisma.user.findUnique({
      where: { userId: user.userId },
      include: {
        userBadge: true,
      },
    });
    if (!baseUser) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (answer) {
      await makeMatchPartner(baseUser, 5);
    }

    return NextResponse.json(
      { isPassed: newQuizLog.isPassed },
      { status: 201 },
    );
  } catch (error) {
    console.error("퀴즈 로그를 생성하지 못했습니다: ", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
