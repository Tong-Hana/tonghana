export type SignupRequest = {
  nickname: string;
  email: string;
  password: string;
  birthYear: number;
  gender: string;
  city: string;
  district: string;
};

export interface SignupResponse {
  message: string;
  user: {
    userId: string;
    email: string;
    nickname: string;
  };
}

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const res = await fetch("/api/signup", {
    method: "POST",
    body: JSON.stringify({
      nickname: data.nickname,
      email: data.email,
      password: data.password,
      birthYear: data.birthYear,
      gender: data.gender,
      city: `${data.city} ${data.district}`,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? "회원가입에 실패했습니다.");
  }

  return res.json();
};
