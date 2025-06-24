"use client";

import Button from "@/components/common/button/Button";
import { CheckCircle } from "@/assets/assets";
import { useEffect, useState } from "react";

export default function ChatWarningModal() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleHideChatWarning = () => {
    localStorage.setItem("hideChatWarning", "true");
    setShowModal(false);
  };

  useEffect(() => {
    const hideChatWarning = localStorage.getItem("hideChatWarning");
    if (hideChatWarning !== "true") {
      setShowModal(true);
    }
  }, []);

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
          <div className="rounded-md border-t-8 border-t-hanared-dark bg-background mx-5 px-6 py-5 w-full max-w-100">
            <p className="flex items-center mb-4 gap-1 text-red-600 text-2xl font-semibold">
              <CheckCircle className="fill-red-600 w-8 h-8" />
              주의
            </p>

            <p className="mb-5 text-sm text-text-primary font-normal">
              타인을 비난하거나 <strong>욕설</strong>을 사용할 경우, 서비스
              이용이 제한될 수 있습니다.
              <br />
              <br />
              <strong>금전 요구, 투자 권유, 외부 링크 공유 등</strong>은
              <br />
              <strong>{"\'로맨스 스캠\'"}</strong>으로 간주될 수 있으며,
              <br />
              → 형법 제347조(사기죄)에 따라 처벌 대상이 될 수 있습니다.
              <br />
              <br />
              타인의 <strong>금융정보, 개인정보를 요구</strong>하거나 무단
              공유할 경우,
              <br />→ 정보통신망법 위반으로 최대 5년 이하 징역 또는 5천만 원
              이하 벌금에 처해질 수 있습니다.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                className="rounded-md text-sm font-normal w-32"
                intent="black"
                size="lg"
                onClick={handleHideChatWarning}
              >
                다시 보지 않기
              </Button>
              <Button
                className="rounded-md text-sm font-normal w-32"
                intent="green"
                size="lg"
                onClick={() => setShowModal(false)}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
