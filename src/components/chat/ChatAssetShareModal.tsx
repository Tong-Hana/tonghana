"use client";

import Button from "@/components/common/button/Button";
import { CheckCircle } from "@/assets/assets";
import {
  useAgreeToShareAsset,
  useRejectToShareAsset,
} from "@/hooks/chat/useAssetShare";
import { AssetShareStatus } from "@/app/types/client-chat";

type Props = {
  showModal: boolean;
  onClose: () => void;
  myId: number;
  roomId: number;
  status: AssetShareStatus;
};

export default function ChatAssetShareModal({
  showModal,
  onClose,
  myId,
  roomId,
  status,
}: Props) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const agreeToShareAssetMutation = useAgreeToShareAsset(status);

  const handleAgreeToShareAsset = async () => {
    if (!myId) return;
    agreeToShareAssetMutation.mutate({
      myId,
      roomId,
    });
  };

  const rejectToShareAssetMutation = useRejectToShareAsset();

  const handleRejectToShareAsset = async () => {
    if (!myId) return;
    rejectToShareAssetMutation.mutate({
      myId,
      roomId,
    });
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
          <div className="rounded-md border-t-8 border-t-hanagreen-normal bg-background mx-5 px-6 py-5 w-full max-w-100">
            <p className="flex items-center mb-4 gap-1 text-hanagreen-normal text-2xl font-semibold">
              <CheckCircle className="fill-hanagreen-normal w-8 h-8" />
              자산 공유 요청
            </p>

            <p className="mb-5 text-sm text-text-primary font-normal">
              상대방이 자산 공유를 요청했습니다.
              <br />
              수락 시 서로의 프로필에서 총 자산을 확인할 수 있습니다.
            </p>

            <div className="flex justify-center gap-2">
              <Button
                className="rounded-md text-sm font-normal w-32"
                intent="black"
                size="lg"
                onClick={handleRejectToShareAsset}
              >
                거절하기
              </Button>
              <Button
                className="rounded-md text-sm font-normal w-32"
                intent="green"
                size="lg"
                onClick={handleAgreeToShareAsset}
              >
                수락하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
