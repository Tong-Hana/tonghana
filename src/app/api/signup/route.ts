import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            nickname,
            email,
            password,
            birthYear,
            gender,
            city,
            district
        } = body;

        if (!nickname || !email || !password || !birthYear || !gender || !city || !district) {
            return NextResponse.json({ message: '필수 값을 입력해주세요.' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 409 });
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
                district,
            },
        });

        return NextResponse.json({ message: '회원가입 성공', userId: newUser.userId }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: '서버 오류' }, { status: 500 });
    }
}