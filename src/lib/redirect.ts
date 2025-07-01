import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * URL 파라미터에서 redirect 경로를 가져오는 함수
 * @param searchParams - Next.js의 useSearchParams()에서 가져온 파라미터
 * @param defaultPath - redirect 파라미터가 없을 때 기본 경로 (기본값: '/home')
 * @returns 안전한 리다이렉트 경로
 */
export function getRedirectPath(
  searchParams: ReadonlyURLSearchParams,
  defaultPath: string = "/home",
): string {
  const redirect = searchParams.get("redirect");

  if (!redirect) {
    return defaultPath;
  }

  // 보안을 위해 외부 URL이나 위험한 경로 차단
  if (isUnsafeRedirectPath(redirect)) {
    console.warn(`⚠️ 안전하지 않은 리다이렉트 경로 차단: ${redirect}`);
    return defaultPath;
  }

  return redirect;
}

/**
 * 안전하지 않은 리다이렉트 경로인지 확인하는 함수
 * @param path - 확인할 경로
 * @returns 안전하지 않으면 true
 */
export function isUnsafeRedirectPath(path: string): boolean {
  // 외부 URL 차단 (http:// 또는 https://)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return true;
  }

  // 프로토콜 상대 URL 차단 (//)
  if (path.startsWith("//")) {
    return true;
  }

  // 자바스크립트 URL 차단
  if (path.startsWith("javascript:") || path.startsWith("data:")) {
    return true;
  }

  // 상대 경로가 아닌 경우 차단 (반드시 /로 시작해야 함)
  if (!path.startsWith("/")) {
    return true;
  }

  // API 경로로의 리다이렉트 차단
  if (path.startsWith("/api/")) {
    return true;
  }

  // 로그인/회원가입 페이지로의 리다이렉트 차단 (무한 루프 방지)
  if (path === "/login" || path === "/signup") {
    return true;
  }

  return false;
}

/**
 * 현재 경로가 보호된 페이지인지 확인하는 함수
 * 미들웨어의 protectedPagePaths와 동일한 로직
 * @param pathname - 확인할 경로
 * @returns 보호된 페이지이면 true
 */
export function isProtectedPage(pathname: string): boolean {
  const protectedPagePaths = [
    "/home",
    "/profile",
    "/quiz",
    "/chat",
    "/like",
    "/card",
    "/chatroom",
    "/quiz-detail",
  ];

  return (
    protectedPagePaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/like") ||
    pathname.startsWith("/card")
  );
}

/**
 * 로그인 성공 후 사용할 리다이렉트 함수
 * @param router - Next.js의 useRouter()
 * @param searchParams - useSearchParams()
 * @param defaultPath - 기본 리다이렉트 경로
 */
export function handleLoginRedirect(
  router: { push: (url: string) => void },
  searchParams: ReadonlyURLSearchParams,
  defaultPath: string = "/home",
): void {
  const redirectPath = getRedirectPath(searchParams, defaultPath);

  console.log(`✅ 로그인 성공 - 리다이렉트: ${redirectPath}`);
  router.push(redirectPath);
}

/**
 * 로그아웃 시 현재 페이지가 보호된 페이지라면 로그인 페이지로 리다이렉트
 * @param router - Next.js의 useRouter()
 * @param currentPath - 현재 페이지 경로
 */
export function handleLogoutRedirect(
  router: { push: (url: string) => void },
  currentPath: string,
): void {
  if (isProtectedPage(currentPath)) {
    console.log(
      `🔐 로그아웃 후 보호된 페이지에서 로그인 페이지로 이동: ${currentPath}`,
    );
    router.push("/login");
  }
}

/**
 * 로그인이 필요한 페이지 접근 시 로그인 페이지로 리다이렉트 (클라이언트용)
 * @param router - Next.js의 useRouter()
 * @param currentPath - 현재 시도하는 경로
 */
export function redirectToLogin(
  router: { push: (url: string) => void },
  currentPath: string,
): void {
  const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
  console.log(`🔐 인증 필요 - 로그인 페이지로 이동: ${currentPath}`);
  router.push(loginUrl);
}
