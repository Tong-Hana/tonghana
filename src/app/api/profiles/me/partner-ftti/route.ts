/**
 * @swagger
 * /api/profiles/me/partner-ftti:
 *   patch:
 *     tags:
 *       - Profiles
 *     summary: 상대방 투자 성향 저장
 *     description: 숫자(1~5)를 받아 상대방의 투자 성향을 preferredType 필드에 저장합니다. 이 값은 사용자의 실제 성향이 아니라 상대방에 대한 판단입니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: integer
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: |
 *                   선택한 투자 성향 유형을 나타냅니다.
 *                   - 1: 안정형 (CONSERVATIVE)
 *                   - 2: 안정추구형 (MODERATE)
 *                   - 3: 위험중립형 (NEUTRAL)
 *                   - 4: 적극투자형 (AGGRESSIVE)
 *                   - 5: 공격투자형 (VERY_AGGRESSIVE)
 *                 example: 3
 *     responses:
 *       200:
 *         description: 상대방 투자 성향 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "상대방 투자 성향이 성공적으로 저장되었습니다."
 *                 partnerType:
 *                   type: string
 *                   enum: [CONSERVATIVE, MODERATE, NEUTRAL, AGGRESSIVE, VERY_AGGRESSIVE]
 *                   example: "NEUTRAL"
 *       400:
 *         description: 잘못된 요청 (type 값 오류 등)
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { masterPrisma } from "@/lib/prisma/masterClient";
import { updateUserPreferredVector } from "@/lib/actions/saveUserVector";

export async function PATCH(req: Request) {
  try {
    const { type } = await req.json();

    // 1. 유효성 검사
    if (![1, 2, 3, 4, 5].includes(type)) {
      return NextResponse.json(
        { error: "잘못된 type 값입니다. 1~5 사이의 숫자를 입력하세요." },
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

    // 3. 숫자 → enum 매핑
    const typeMap = {
      1: "CONSERVATIVE",
      2: "MODERATE",
      3: "NEUTRAL",
      4: "AGGRESSIVE",
      5: "VERY_AGGRESSIVE",
    } as const;

    const mappedType = typeMap[type as keyof typeof typeMap];

    // 4. DB 저장
    const updateUser = await masterPrisma.user.update({
      where: { userId: user.userId },
      data: {
        preferredType: mappedType,
      },
    });

    // 5. 벡터 저장
    await updateUserPreferredVector(updateUser);

    return NextResponse.json({
      message: "상대방 투자 성향이 성공적으로 저장되었습니다.",
      partnerType: mappedType,
    });
  } catch (err) {
    console.error("❌ 상대 FTTI 저장 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
