/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 이메일과 비밀번호를 입력받아 사용자를 인증하고 JWT 토큰을 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123!"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: JWT가 담긴 accessToken 쿠키
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인에 성공하였습니다."
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 잘못된 요청 또는 비밀번호 오류
 *       404:
 *         description: 존재하지 않는 사용자
 *       500:
 *         description: 서버 오류
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { code: "INVALID_INPUT", message: "이메일과 비밀번호를 입력하세요." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { code: "NON_EXIST_USER", message: "존재하지 않는 사용자입니다." },
        { status: 404 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { code: "WRONG_PASSWORD", message: "비밀번호가 틀렸습니다." },
        { status: 400 },
      );
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    const response = NextResponse.json({
      message: "로그인에 성공하였습니다.",
      accessToken: token,
    });

    response.cookies.set({
      name: "accessToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1일
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
