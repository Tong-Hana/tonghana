import { cookies } from "next/headers";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

interface AuthUser {
  userId: number;
  email: string;
}

/**
 * 미들웨어에서 검증된 유저 정보를 헤더에서 가져오는 함수
 * 성능이 더 좋으며 미들웨어와 함께 사용 권장
 */
export async function getAuthUserFromHeader(): Promise<AuthUser | null> {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");
  const email = headersList.get("x-user-email");

  if (!userId || !email) {
    return null;
  }

  return {
    userId: parseInt(userId, 10),
    email,
  };
}

/**
 * 쿠키에서 직접 토큰을 검증하는 기존 함수 (호환성 유지)
 * 미들웨어를 사용하지 않는 경우나 레거시 코드를 위해 유지
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch (err) {
    console.error("❌ 토큰 검증 실패:", err);
    return null;
  }
}

/**
 * 통합 인증 함수 - 미들웨어 헤더를 먼저 확인하고, 없으면 쿠키에서 검증
 * 미들웨어가 적용된 라우터와 그렇지 않은 라우터 모두에서 사용 가능
 */
export async function getAuthUserUnified(): Promise<AuthUser | null> {
  // 먼저 미들웨어에서 설정한 헤더 확인
  const userFromHeader = await getAuthUserFromHeader();
  if (userFromHeader) {
    return userFromHeader;
  }

  // 헤더에 없으면 쿠키에서 직접 검증
  return await getAuthUser();
}
