/**
 * @swagger
 * /api/delete-account:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: 사용자 회원탈퇴
 *     description: 로그인한 사용자의 계정을 탈퇴 처리합니다. 실제로 삭제하지 않고 isDeleted 값을 true로 설정합니다. (Soft Delete)
 *     responses:
 *       200:
 *         description: 회원 탈퇴가 성공적으로 처리됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원 탈퇴가 완료되었습니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 만료)
 *       500:
 *         description: 서버 내부 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        isDeleted: true,
      },
    });

    const response = NextResponse.json({
      message: "회원 탈퇴가 완료되었습니다.",
    });

    // accessToken 쿠키 삭제
    response.cookies.set({
      name: "accessToken",
      value: "",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("SoftDelete Error:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
