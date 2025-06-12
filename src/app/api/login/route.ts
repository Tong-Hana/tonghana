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
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { code: "NON_EXIST_USER", message: "존재하지 않는 사용자입니다." },
                { status: 404 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { code: "WRONG_PASSWORD", message: "비밀번호가 틀렸습니다." },
                { status: 400 }
            );
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
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
            { status: 500 }
        );
    }
}