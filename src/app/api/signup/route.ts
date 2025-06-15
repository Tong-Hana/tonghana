/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 필수 정보를 입력받아 새로운 사용자를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - email
 *               - password
 *               - birthYear
 *               - gender
 *               - city
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "홍길동"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "hong@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePass123!"
 *               birthYear:
 *                 type: integer
 *                 example: 1995
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 example: "M"
 *               city:
 *                 type: string
 *                 example: "서울시 성동구"
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입에 성공하였습니다."
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "hong@example.com"
 *                     nickname:
 *                       type: string
 *                       example: "홍길동"
 *       400:
 *         description: 입력값 누락
 *       409:
 *         description: 이메일 중복
 *       500:
 *         description: 서버 오류
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, email, password, birthYear, gender, city } = body;

    if (!nickname || !email || !password || !birthYear || !gender || !city) {
      return NextResponse.json(
        { code: "INVALID_INPUT", message: "필수 값을 입력해주세요." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { code: "ALREADY_EXISTS", message: "이미 존재하는 이메일입니다." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nickname,
        email,
        password: hashedPassword,
        birthYear,
        gender,
        city,
      },
    });

    return NextResponse.json(
      {
        message: "회원가입에 성공하였습니다.",
        user: {
          userId: newUser.userId,
          email: newUser.email,
          nickname: newUser.nickname,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
