"use client";

import { AssetShareStatus } from "@/app/types/client-chat";
import { CheckCircle } from "@/assets/assets";
import { useAgreeToShareAsset } from "@/hooks/chat/useAssetShare";

type Props = {
  status: AssetShareStatus;
  myId?: number;
  roomId: number;
  onOpenAssetShareModal: () => void;
};

export default function AssetShareButtonGroup({
  status,
  myId,
  roomId,
  onOpenAssetShareModal,
}: Props) {
  const agreeToShareAssetMutation = useAgreeToShareAsset();

  const handleAgreeToShareAsset = async () => {
    if (!myId) return;
    agreeToShareAssetMutation.mutate({
      myId,
      roomId,
    });
  };

  // 내가 아직 동의하지 않았고, 둘 다 미동의
  if (status === AssetShareStatus.PENDING) {
    return (
      <button
        type="button"
        onClick={handleAgreeToShareAsset}
        className="px-5 py-2 border border-hanared-normal text-sm rounded-2xl text-hanared-normal bg-white hover:bg-hanared-light-hover w-fit self-center"
      >
        🤝🏻 내 자산 공개하기
      </button>
    );
  }

  // 내가 동의했고 상대가 아직 동의 안 했음
  if (status === AssetShareStatus.PARTNER_AGREED) {
    return (
      <div className="flex self-center">
        <button
          type="button"
          onClick={onOpenAssetShareModal}
          className="px-5 py-2 border border-hanagreen-normal text-sm rounded-2xl text-hanagreen-normal bg-white hover:bg-hanagreen-light-hover w-fit self-center"
        >
          <div className="flex gap-1 items-center">
            <CheckCircle className="h-5 w-5" />
            자산 공유 요청 확인
          </div>
        </button>
      </div>
    );
  }

  return null;
}
