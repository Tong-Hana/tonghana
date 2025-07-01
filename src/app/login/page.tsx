"use client";

import Image from "next/image";
import LoginForm from "@/components/login/LoginForm";
import Header from "@/components/common/Header";
import { Suspense } from "react";

function LoginContent() {
  return (
    <>
      <Image
        src="/tonghana.png"
        alt="통하나 로고"
        width={150}
        height={150}
        className="mb-10"
      />
      <LoginForm />
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="로그인" />
      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <Suspense
          fallback={
            <div className="flex flex-1 flex-col items-center justify-center px-5">
              <Image
                src="/tonghana.png"
                alt="통하나 로고"
                width={150}
                height={150}
                className="mb-10"
              />
              <div className="w-full max-w-[414px] animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
