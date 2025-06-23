"use client";

import { useState } from "react";
import Button from "../common/button/Button";
import InputWithLabel from "../common/input/InputWithLabel";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/validators";
import { useLogin } from "@/hooks/useLogin";
import { useUserStore } from "@/lib/store/userStore";
import { checkProfileRegistrationStatus } from "@/services/myProfile";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const setNickname = useUserStore((state) => state.setNickname);

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const loginMutation = useLogin(
    async (data) => {
      if (data.user) {
        setNickname(data.user.nickname);

        try {
          const profileStatus = await checkProfileRegistrationStatus();

          if (profileStatus.isRegistered) {
            router.push("/home");
          } else {
            router.push("/profile-setup");
          }
        } catch {
          toast.error("프로필 상태 확인에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        toast.error("로그인 정보를 확인할 수 없습니다. 다시 시도해주세요.");
      }
      setIsSubmitting(false);
    },
    (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(email && validateEmail(email) && password)) {
      toast.error("입력한 정보가 올바르지 않습니다");
      return;
    }

    setIsSubmitting(true);

    loginMutation.mutate({
      email: email,
      password: password,
    });
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col max-w-[414px] w-full justify-center items-center gap-5"
    >
      <InputWithLabel
        label={"이메일"}
        placeholder="이메일을 입력해주세요"
        value={email}
        onChange={handleChangeEmail}
      />
      <InputWithLabel
        label={"비밀번호"}
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={handleChangePassword}
      />
      <Button
        className="rounded-lg"
        type="submit"
        label="로그인"
        intent={"green"}
        size={"full"}
        loading={isSubmitting}
      ></Button>
      <Link href={"/signup"}>
        <p className="text-sm text-text-secondary">회원가입 하러가기</p>
      </Link>
    </form>
  );
}
