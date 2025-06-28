"use client";

import { cn } from "@/utils/cn";
import { PropsWithChildren, useEffect } from "react";
import Button from "./button/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BottomSheet({
  open,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        />
      )}
      <div
        className={cn(
          "fixed frame-container h-full bottom-0 left-0 right-0 z-50 transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        )}
        style={{ maxHeight: "90vh", zIndex: 60 }}
      >
        <div className="relative flex flex-col items-center w-full h-full rounded-t-3xl bg-white">
          {children}
          {/* 바텀시트 하단버튼 */}
          <div className="absolute bottom-0 left-0 py-4 px-5 w-full bg-white">
            <Button
              className="w-full rounded-lg"
              intent="green"
              size="full"
              onClick={onClose}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
