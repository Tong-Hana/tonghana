/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 사용자 로그아웃
 *     description: accessToken 쿠키를 삭제하여 로그아웃 처리합니다.
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃 되었습니다."
 */

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "로그아웃 되었습니다." });

  response.cookies.set({
    name: "accessToken",
    value: "",
    maxAge: 0, // 쿠키 삭제
    path: "/",
  });

  return response;
}
