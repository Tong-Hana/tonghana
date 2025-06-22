const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ERROR_MESSAGES = {
  401: "인증이 필요합니다.",
  403: "접근이 거부되었습니다.",
  429: "잠시 후 다시 시도해주세요.",
  default: "처리 중 오류가 발생했습니다.",
} as const;

export async function customFetch<T = unknown>(
  input: RequestInfo,
  init?: RequestInit & { skipJsonParse?: boolean },
): Promise<T> {
  const url =
    typeof input === "string" && !input.startsWith("http")
      ? `${BASE_URL}${input}`
      : input;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const statusCode = res.status as keyof typeof ERROR_MESSAGES;
    const errorMessage = ERROR_MESSAGES[statusCode] || ERROR_MESSAGES.default;
    throw new Error(errorMessage);
  }

  if (init?.skipJsonParse) {
    return res as unknown as T;
  }

  try {
    return await res.json();
  } catch {
    throw new Error("응답 데이터를 처리할 수 없습니다.");
  }
}
