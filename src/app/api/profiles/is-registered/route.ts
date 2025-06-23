/**
 * @swagger
 * /api/profiles/is-registered:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: 프로필 등록 여부 확인
 *     description: |
 *       현재 로그인한 사용자가 프로필 등록을 완료했는지 여부를 확인합니다.
 *       profileImage, description, job, goalType, goalAmount, goalPeriod 필드가 모두 채워져 있으면 true를 반환합니다.
 *     responses:
 *       200:
 *         description: 프로필 등록 여부 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isRegistered:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: 인증되지 않음
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
 *       500:
 *         description: 서버 오류
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
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { userId: user.userId },
      select: {
        profileImage: true,
        description: true,
        job: true,
        goalType: true,
        goalAmount: true,
        goalPeriod: true,
      },
    });

    const isRegistered = !!(
      currentUser?.profileImage &&
      currentUser?.description &&
      currentUser?.job &&
      currentUser?.goalType &&
      currentUser?.goalAmount &&
      currentUser?.goalPeriod
    );

    return NextResponse.json({ isRegistered }, { status: 200 });
  } catch (error) {
    console.error("❌ 프로필 등록 여부 확인 실패:", error);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR", message: "서버 오류" },
      { status: 500 },
    );
  }
}
