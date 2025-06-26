"use client";

import { PropsWithChildren } from "react";
import Button from "@/components/common/button/Button";

type Props = {
  title: string;
  content: string;
  open?: boolean;
  onAction: () => void;
  onClose: () => void;
};

export default function DialogButton({
  title,
  content,
  open,
  onAction,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  const showModal = open ?? true;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {children}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
          <div className="rounded-3xl border border-background bg-white mx-5 px-8 pt-6 pb-5 shadow-sm w-full max-w-80">
            <h2 className="mb-4 text-xl font-semibold text-hanagreen-normal">
              {title}
            </h2>

            <p className="mb-6 text-base text-text-primary whitespace-pre-wrap">
              {content}
            </p>

            <div className="flex w-full gap-4 px-0">
              <Button
                className="rounded-lg"
                intent="black"
                size="full"
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                className="rounded-lg"
                intent="green"
                size="full"
                onClick={onAction}
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
