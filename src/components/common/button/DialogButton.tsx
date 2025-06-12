"use client";

import { PropsWithChildren, useState } from "react";
import Button from "@/components/common/button/Button";

type Props = {
  title: string;
  content: string;
  onAction: () => void;
};

export default function DialogButton({
  title,
  content,
  onAction,
  children,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
          <div className="rounded-3xl border border-background bg-white mx-5 px-8 pt-6 pb-5 shadow-sm w-full max-w-80">
            <h2 className="mb-4 text-2xl font-semibold text-hanagreen-normal">
              {title}
            </h2>

            <p className="mb-6 text-lg text-text-primary">{content}</p>

            <div className="flex w-full gap-4 px-3">
              <Button
                className="rounded-lg"
                intent="black"
                size="full"
                onClick={handleClose}
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
