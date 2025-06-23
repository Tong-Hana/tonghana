import Image from "next/image";
import LoginForm from "@/components/login/LoginForm";
import Header from "@/components/common/Header";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="로그인" />
      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <Image
          src="/tonghana.png"
          alt="통하나 로고"
          width={150}
          height={150}
          className="mb-10"
        />
        <LoginForm />
      </div>
    </div>
  );
}
