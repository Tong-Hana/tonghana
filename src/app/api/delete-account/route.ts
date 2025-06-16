/**
 * @swagger
 * /api/delete-account:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: 사용자 회원 탈퇴
 *     description: 로그인한 사용자의 계정을 삭제하고 accessToken 쿠키도 제거합니다.
 *     responses:
 *       200:
 *         description: 회원 탈퇴 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원 탈퇴가 완료되었습니다."
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth"; // accessToken → userId 추출 함수

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.delete({
      where: { userId: user.userId },
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
    console.error("DeleteAccount Error:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
