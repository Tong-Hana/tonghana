"use client";

export type AssetShareStatus =
  | "pending"
  | "me_agreed"
  | "other_agreed"
  | "both_agreed"
  | "rejected";

type Props = {
  status: AssetShareStatus;
  onAgree: () => void;
  onReject: () => void;
};

export default function AssetShareButtonGroup({
  status,
  onAgree,
  onReject,
}: Props) {
  if (
    status === "rejected" ||
    status === "both_agreed" ||
    status === "me_agreed"
  )
    return null;

  // 내가 아직 동의하지 않았고, 둘 다 미동의
  if (status === "pending") {
    return (
      <button
        type="button"
        onClick={onAgree}
        className="px-5 py-2 border border-hanared-normal text-sm rounded-2xl text-hanared-normal bg-white hover:bg-hanared-light-hover w-fit self-center"
      >
        🤝🏻 내 자산 공개하기
      </button>
    );
  }

  // 내가 동의했고 상대가 아직 동의 안 했음
  if (status === "other_agreed") {
    return (
      <div className="flex gap-2 self-center">
        <button
          type="button"
          onClick={onReject}
          className="px-5 py-2 border border-hanared-normal text-sm rounded-2xl text-hanared-normal bg-white hover:bg-hanared-light-hover  w-fit self-center"
        >
          ❌ 거절하기
        </button>
        <button
          type="button"
          onClick={onAgree}
          className="px-5 py-2 border border-hanagreen-normal text-sm rounded-2xl text-hanagreen-normal bg-white hover:bg-hanagreen-light-hover w-fit self-center"
        >
          🤝🏻 수락하기
        </button>
      </div>
    );
  }

  return null;
}
