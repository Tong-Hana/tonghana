/**
 * @swagger
 * /api/profiles/is-registered:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: 프로필, 페어링북, FTTI(나/상대방) 등록 여부 확인
 *     description: |
 *       현재 로그인한 사용자가 다음을 모두 완료했는지 확인합니다:
 *       - 프로필 필수 정보 (profileImage, description, job, goalType, goalAmount, goalPeriod)
 *       - 페어링북 응답(PairingAnswer) 존재
 *       - 내 FTTI(currentType) 존재
 *       - 이상형 FTTI(preferredType) 존재재
 *       모두 충족 시 true를 반환합니다.
 *
 *     responses:
 *       200:
 *         description: 등록 여부 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isProfileCompleted:
 *                   type: boolean
 *                 isPairingCompleted:
 *                   type: boolean
 *                 isMyFTTICompleted:
 *                   type: boolean
 *                 isPreferredFTTICompleted:
 *                   type: boolean
 *                 isAllCompleted:
 *                   type: boolean
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
import { replicaPrisma } from "@/lib/prisma/replicaClient";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  try {
    const [currentUser, pairingAnswer] = await Promise.all([
      replicaPrisma.user.findUnique({
        where: { userId: user.userId },
        select: {
          profileImage: true,
          description: true,
          job: true,
          goalType: true,
          goalAmount: true,
          goalPeriod: true,
          preferredType: true,
          currentType: true,
        },
      }),
      replicaPrisma.pairingAnswer.findUnique({
        where: { userId: user.userId },
        select: { id: true }, // 존재 여부만 확인
      }),
    ]);

    const isProfileCompleted = !!(
      currentUser?.profileImage &&
      currentUser?.description &&
      currentUser?.job &&
      currentUser?.goalType &&
      currentUser?.goalAmount &&
      currentUser?.goalPeriod
    );

    const isPairingCompleted = !!pairingAnswer;
    const isMyFTTICompleted = !!currentUser?.currentType;
    const isPreferredFTTICompleted = !!currentUser?.preferredType;
    const isAllCompleted =
      isProfileCompleted &&
      isPairingCompleted &&
      isMyFTTICompleted &&
      isPreferredFTTICompleted;

    return NextResponse.json(
      {
        isProfileCompleted,
        isPairingCompleted,
        isMyFTTICompleted,
        isPreferredFTTICompleted,
        isAllCompleted,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ 등록 여부 확인 실패:", error);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR", message: "서버 오류" },
      { status: 500 },
    );
  }
}
