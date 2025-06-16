import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface AuthUser {
  userId: number;
  email: string;
}

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
