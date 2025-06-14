"use client";

import Button from "../common/button/Button";
import InputWithLabel from "../common/input/InputWithLabel";
import Link from "next/link";

export default function LoginForm() {
  return (
    <form className="flex flex-col max-w-[414px] w-full justify-center items-center gap-5">
      <InputWithLabel
        label={"아이디"}
        name="id"
        placeholder="아이디를 입력해주세요"
      />
      <InputWithLabel
        label={"비밀번호"}
        name="password"
        placeholder="비밀번호를 입력해주세요"
      />
      <Button
        className="rounded-lg"
        label="로그인"
        intent={"green"}
        size={"full"}
      ></Button>
      <Link href={"/signup"}>
        <p className="text-sm text-text-secondary">회원가입 하러가기</p>
      </Link>
    </form>
  );
}
