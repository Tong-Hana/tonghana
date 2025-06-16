import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { MatchStatus } from "@prisma/client";

// 테스트용 매칭 데이터
async function createTestMatchLog() {
  const matchesToCreate = [
    { sentId: 199, receiveId: 186, matchStatus: MatchStatus.ACCEPTED },
    { sentId: 199, receiveId: 184, matchStatus: MatchStatus.PENDING },
  ];

  for (const match of matchesToCreate) {
    const existing = await prisma.userMatchLog.findFirst({
      where: {
        sentId: match.sentId,
        receiveId: match.receiveId,
      },
    });

    if (!existing) {
      await prisma.userMatchLog.create({ data: match });
    } else {
      console.log(
        `이미 존재하는 매칭: ${match.sentId} → ${match.receiveId}, 생략됨`,
      );
    }
  }
}
createTestMatchLog()
  .catch((e) => {
    console.error("에러 발생:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// 채팅방 리스트 조회
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { code: "UNAUTHORIZED", message: "인증되지 않았습니다." },
      { status: 401 },
    );
  }

  const chatRooms = await prisma.chatRooms.findMany({
    where: {
      OR: [{ userId: user.userId }, { userId2: user.userId }],
    },
    include: {
      chatMessages: {
        orderBy: { regdate: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json({ chatRooms });
}

// 채팅방 생성하기
// TODO: 좋아요 수락/거절 여부에 따라 채팅방 자동 개설
export async function POST() {
  const acceptedMatches = await prisma.userMatchLog.findMany({
    where: { matchStatus: "ACCEPTED" },
  });

  for (const match of acceptedMatches) {
    const existingRoom = await prisma.chatRooms.findFirst({
      where: {
        OR: [
          { userId: match.sentId, userId2: match.receiveId },
          { userId: match.receiveId, userId2: match.sentId },
        ],
      },
    });

    if (!existingRoom) {
      await prisma.chatRooms.create({
        data: {
          userId: match.sentId,
          userId2: match.receiveId,
          isAgree: false,
          isAgree2: false,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
