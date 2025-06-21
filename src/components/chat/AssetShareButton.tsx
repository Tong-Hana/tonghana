"use client";

import { AssetShareStatus } from "@/app/types/client-chat";
import {
  useAgreeToShareAsset,
  useRejectToShareAsset,
} from "@/hooks/chat/useAssetShare";
import toast from "react-hot-toast";

type Props = {
  status: AssetShareStatus;
  myId?: number;
  roomId: number;
};

export default function AssetShareButtonGroup({ status, myId, roomId }: Props) {
  const agreeToShareAssetMutation = useAgreeToShareAsset(
    () => {
      if (status === AssetShareStatus.PENDING) {
        toast.success(
          "자산 공유가 요청되었습니다.\n상대방이 동의할 경우 서로의 프로필에서 자산을 확인할 수 있습니다.",
          { duration: 3000 },
        );
        return;
      }

      if (status === AssetShareStatus.PARTNER_AGREED) {
        toast.success(
          "자산 공유에 동의하셨습니다.\n서로의 프로필에서 자산을 확인할 수 있습니다.",
          { duration: 3000 },
        );
        return;
      }
    },
    (error) => {
      toast.error(error.message ?? "자산 공유에 실패했습니다.");
    },
  );

  const handleAgreeToShareAsset = async () => {
    if (!myId) return;
    agreeToShareAssetMutation.mutate({
      myId,
      roomId,
    });
  };

  const rejectToShareAssetMutation = useRejectToShareAsset(
    () => {
      toast.success("자산 공유에 거절하셨습니다");
    },
    (error) => {
      toast.error(error.message ?? "자산 공유 거절에 실패했습니다.");
    },
  );

  const handleRejectToShareAsset = async () => {
    if (!myId) return;
    rejectToShareAssetMutation.mutate({
      myId,
      roomId,
    });
  };

  if (
    !myId ||
    status === "rejected" ||
    status === "both_agreed" ||
    status === "me_agreed"
  )
    return null;

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
      <div className="flex gap-2 self-center">
        <button
          type="button"
          onClick={handleRejectToShareAsset}
          className="px-5 py-2 border border-hanared-normal text-sm rounded-2xl text-hanared-normal bg-white hover:bg-hanared-light-hover  w-fit self-center"
        >
          ❌ 거절하기
        </button>
        <button
          type="button"
          onClick={handleAgreeToShareAsset}
          className="px-5 py-2 border border-hanagreen-normal text-sm rounded-2xl text-hanagreen-normal bg-white hover:bg-hanagreen-light-hover w-fit self-center"
        >
          🤝🏻 수락하기
        </button>
      </div>
    );
  }

  return null;
}
