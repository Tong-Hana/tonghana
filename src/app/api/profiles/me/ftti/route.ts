import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 실제 prisma client 경로에 맞춰 수정
import { getAuthUser } from "@/lib/auth"; // 로그인 유저 식별 함수 (쿠키 기반이라 가정)

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    // 1. 유효성 검사
    if (!Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: "잘못된 응답 형식입니다." },
        { status: 400 },
      );
    }

    // 2. 로그인 유저 정보 추출
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    // 3. 2번 선택 개수 계산
    const countOfType2 = answers.filter((a) => a === 1).length;

    // 4. 투자 성향 판단
    let preferredType:
      | "CONSERVATIVE"
      | "MODERATE"
      | "NEUTRAL"
      | "AGGRESSIVE"
      | "VERY_AGGRESSIVE";

    if (countOfType2 <= 2) preferredType = "CONSERVATIVE";
    else if (countOfType2 <= 4) preferredType = "MODERATE";
    else if (countOfType2 <= 6) preferredType = "NEUTRAL";
    else if (countOfType2 <= 8) preferredType = "AGGRESSIVE";
    else preferredType = "VERY_AGGRESSIVE";

    // 5. Prisma로 유저 정보 업데이트
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        preferredType, // enum 필드에 저장
      },
    });

    return NextResponse.json({
      message: "투자 성향 분석 결과가 성공적으로 저장되었습니다.",
      resultType: preferredType,
    });
  } catch (err) {
    console.error("❌ FTTI API 오류:", err);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
