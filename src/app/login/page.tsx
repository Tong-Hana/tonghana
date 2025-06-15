import Image from "next/image";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen justify-center">
      <div className="flex flex-col gap-5 justify-center items-center">
        <Image
          src="hana_logo.svg"
          alt="하나은행 로고"
          width={150}
          height={150}
        />
        <LoginForm />
      </div>
    </div>
  );
}
