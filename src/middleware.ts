import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// === 보안 기능들 ===

// 보안 헤더 설정
function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

// 요청 크기 제한 체크
function checkRequestSize(
  request: NextRequest,
  maxSize: number = 10 * 1024 * 1024,
): boolean {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    return false;
  }
  return true;
}

// IP 주소 기반 차단
const blockedIPs = new Set<string>();
const suspiciousActivity = new Map<
  string,
  { count: number; lastActivity: number }
>();

function checkIPRestriction(request: NextRequest): boolean {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (blockedIPs.has(ip)) {
    return false;
  }

  const now = Date.now();
  const activity = suspiciousActivity.get(ip);

  if (activity) {
    // 1분 내에 50회 이상 요청 시 차단
    if (now - activity.lastActivity < 60000 && activity.count > 50) {
      blockedIPs.add(ip);
      return false;
    }

    // 5분이 지나면 카운트 리셋
    if (now - activity.lastActivity > 300000) {
      activity.count = 1;
    } else {
      activity.count++;
    }
    activity.lastActivity = now;
  } else {
    suspiciousActivity.set(ip, { count: 1, lastActivity: now });
  }

  return true;
}

// User-Agent 검증
function validateUserAgent(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent");

  if (!userAgent) {
    return false;
  }

  // 개발 환경에서는 제한하지 않음
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // 의심스러운 User-Agent 패턴
  const suspiciousUA = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java|go-http/i,
    /sqlmap|nmap|nikto|burp|zap/i,
  ];

  return !suspiciousUA.some((pattern) => pattern.test(userAgent));
}

// Rate limiting
const requestHistory = new Map<string, number[]>();

function analyzeRequestFrequency(
  identifier: string,
  maxRequestsPerMinute: number = 60,
): boolean {
  const now = Date.now();
  const history = requestHistory.get(identifier) || [];

  // 1분 이전의 요청들 제거
  const recentRequests = history.filter((time) => now - time < 60000);

  if (recentRequests.length >= maxRequestsPerMinute) {
    return false;
  }

  recentRequests.push(now);
  requestHistory.set(identifier, recentRequests);

  return true;
}

// CSRF 토큰 검증
function validateCSRFToken(request: NextRequest): boolean {
  const methods = ["POST", "PUT", "PATCH", "DELETE"];
  if (!methods.includes(request.method)) {
    return true;
  }

  // 개발 환경에서는 검증 생략
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL,
    "http://localhost:3000",
    "https://localhost:3000",
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  if (
    referer &&
    allowedOrigins.some((allowed) => referer.startsWith(allowed as string))
  ) {
    return true;
  }

  return false;
}

// JWT 토큰 유효성 검증 함수
function isValidToken(token: string): boolean {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not set");
      return false;
    }

    // JWT 토큰 검증 (만료시간, 서명 등 자동 확인)
    jwt.verify(token, jwtSecret);
    return true;
  } catch {
    // 토큰이 만료되었거나 유효하지 않음
    return false;
  }
}

// === 메인 미들웨어 ===

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isDev = process.env.NODE_ENV === "development";

  // 1. 요청 크기 제한
  if (!checkRequestSize(request)) {
    const response = NextResponse.json(
      { code: "PAYLOAD_TOO_LARGE", message: "요청 크기가 너무 큽니다." },
      { status: 413 },
    );
    return withSecurityHeaders(response);
  }

  // 2. IP 기반 보안 체크 (프로덕션만)
  if (!isDev && !checkIPRestriction(request)) {
    const response = NextResponse.json(
      { code: "FORBIDDEN", message: "접근이 차단되었습니다." },
      { status: 403 },
    );
    return withSecurityHeaders(response);
  }

  // 3. User-Agent 검증 (프로덕션만)
  if (!isDev && !validateUserAgent(request)) {
    const response = NextResponse.json(
      { code: "FORBIDDEN", message: "유효하지 않은 클라이언트입니다." },
      { status: 403 },
    );
    return withSecurityHeaders(response);
  }

  // 4. Rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = isDev ? 1000 : 100; // 개발환경에서는 관대하게

  if (!analyzeRequestFrequency(ip, rateLimit)) {
    const response = NextResponse.json(
      {
        code: "TOO_MANY_REQUESTS",
        message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 429 },
    );
    return withSecurityHeaders(response);
  }

  // 5. CSRF 토큰 검증 (API 요청에만 적용, 프로덕션만)
  if (!isDev && pathname.startsWith("/api/") && !validateCSRFToken(request)) {
    const response = NextResponse.json(
      { code: "FORBIDDEN", message: "CSRF 토큰이 유효하지 않습니다." },
      { status: 403 },
    );
    return withSecurityHeaders(response);
  }

  // 6. 페이지 라우팅 보호 (JWT 토큰 검증)
  if (!pathname.startsWith("/api/")) {
    const protectedPages = [
      "/home",
      "/profile",
      "/quiz",
      "/chat",
      "/like",
      "/card",
      "/chatroom",
      "/quiz-detail",
    ];
    const isProtectedPage = protectedPages.some((page) =>
      pathname.startsWith(page),
    );

    if (isProtectedPage) {
      const accessToken = request.cookies.get("accessToken");

      if (!accessToken || !isValidToken(accessToken.value)) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        const response = NextResponse.redirect(loginUrl);
        return withSecurityHeaders(response);
      }
    }
  }

  // 7. 모든 응답에 보안 헤더 적용
  const response = NextResponse.next();
  return withSecurityHeaders(response);
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
};
