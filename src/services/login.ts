export type LoginRequest = {
  email: string;
  password: string;
};

export interface LoginResponse {
  message: string;
  accessToken?: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "로그인에 실패했습니다.");
  }

  return res.json();
};
