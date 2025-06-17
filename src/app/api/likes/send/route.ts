/**
 * @swagger
 * /api/likes/send:
 *   post:
 *     summary: 특정 유저에게 좋아요 전송
 *     description: 로그인한 사용자가 다른 사용자에게 좋아요를 보냅니다. 이미 좋아요를 보낸 경우 중복 전송은 불가합니다.
 *     tags: [MatchLikes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiveId
 *             properties:
 *               receiveId:
 *                 type: integer
 *                 description: 좋아요를 받을 유저의 ID
 *     responses:
 *       201:
 *         description: 좋아요 전송 성공
 *       400:
 *         description: 자기 자신에게는 보낼 수 없음
 *       409:
 *         description: 이미 좋아요를 보냄
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  const { receiveId } = await req.json();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 },
    );
  }
  const sentId = user.userId;

  if (receiveId === sentId) {
    return NextResponse.json(
      { message: "자기 자신에게는 보낼 수 없습니다." },
      { status: 400 },
    );
  }

  const existing = await prisma.userMatchLog.findFirst({
    where: { sentId, receiveId },
  });

  if (existing) {
    return NextResponse.json(
      { message: "이미 좋아요를 보냈습니다." },
      { status: 409 },
    );
  }

  const match = await prisma.userMatchLog.create({
    data: {
      sentId,
      receiveId,
      matchStatus: "PENDING",
    },
  });

  return NextResponse.json(match, { status: 201 });
}
