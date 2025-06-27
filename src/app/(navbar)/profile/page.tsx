"use client";
import DoughnutChart from "@/components/chart/DoughnutChart";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";
import Button from "@/components/common/button/Button";
import DialogButton from "@/components/common/button/DialogButton";
import { DislikeButton } from "@/components/common/button/ReactionButton";
import ProfileCardDetail from "@/components/profile/ProfileCardDetail";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/common/Header";
import { userProfileOptions } from "@/hooks/useUserProfileQuery";
import Image from "next/image";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { useWithdraw } from "@/hooks/useWithdraw";
import { customUser } from "@/lib/customUserData";
import { customConsumeHistory } from "@/lib/customConsumeHistory";
import { customPairingAnswers } from "@/lib/customParingAnswer";
import { RightArrow } from "@/assets/assets";

export default function MyPage() {
  const { data } = useSuspenseQuery(userProfileOptions("me"));

  const user = customUser(data?.data);
  const consumeHistoryData = customConsumeHistory(data?.data);
  const answer = customPairingAnswers(data?.data?.pairingAnswer);

  const router = useRouter();

  const [showCard, setShowCard] = useState(false);

  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const logoutMutation = useLogout({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (e) => {
      alert(e.message || "로그아웃 실패");
    },
  });

  const withdrawMutation = useWithdraw({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (e) => {
      alert(e.message || "회원탈퇴 실패");
    },
  });

  type MenuItem =
    | {
        name: string;
        type: "link";
        path: string;
      }
    | {
        name: string;
        type: "modal";
        modalProps: {
          title: string;
          content: string;
          onAction: () => void;
        };
      };

  const menuItems: MenuItem[] = [
    {
      name: "내 정보 수정하기",
      type: "link",
      path: "/profile/edit",
    },
    {
      name: "FTTI 설문 다시하기",
      type: "link",
      path: "/profile/ftti",
    },
    {
      name: "로그아웃",
      type: "modal",
      modalProps: {
        title: "로그아웃 하시겠어요?",
        content: "다시 로그인할 수 있습니다.",
        onAction: () => {
          logoutMutation.mutate();
        },
      },
    },
    {
      name: "회원탈퇴",
      type: "modal",
      modalProps: {
        title: "탈퇴 하시겠어요?",
        content: "모든 기록이 삭제됩니다.",
        onAction: () => {
          withdrawMutation.mutate();
        },
      },
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5 px-5 py-2">
        <Header title="마이페이지" centerTitle={false} showBackButton={false} />
        {/* 프로필 */}
        <div className="flex justify-center items-center gap-10 pt-5 pb-3">
          <div className="flex rounded-full w-28 h-28 overflow-hidden">
            <Image
              src={user.imageUrl}
              alt="profile img"
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <p className="text-text-primary text-lg font-medium">{user.name}</p>
            <Button
              intent="green"
              size="md"
              label="내 카드보기"
              onClick={() => setShowCard(true)}
              className="text-[0.8rem] font-normal px-8"
            />
            {/* ProfileCardDetail 모달 */}
            {showCard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="relative bg-white mb-12 rounded-xl shadow-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
                  {/* 닫기 버튼 */}
                  <DislikeButton
                    size="lg"
                    onClick={() => setShowCard(false)}
                    className="absolute top-4 right-4 z-10 "
                    iconClassName="text-hanablack hover:text-gray-500 active:text-gray-900"
                  />
                  <ProfileCardDetail
                    user={user}
                    answers={answer}
                    data={consumeHistoryData}
                    modalView={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg p-5 bg-white w-full space-y-2 shadow-[0px_1px_3px_0px_#0000001A]">
          <h2 className="text-hanagreen-normal font-semibold text-lg">
            내 자산
          </h2>
          <DoughnutChart
            values={user.portfolioRatios}
            portfolioType={user.portfolioType}
            debtLabel={user.debtPercent}
            showPercent={true}
          />
        </div>

        <MonthlySpendingChart data={consumeHistoryData} />
      </div>
      {/* 하단 메뉴 리스트 */}
      <div className="bg-white mt-4 shadow-sm">
        {menuItems.map((item) => {
          const commonClass =
            "flex items-center justify-between w-full px-4 py-4 cursor-pointer text-text-primary text-base font-normal border-t border-gray-200 last:border-b-0 bg-white";

          if (item.type === "link") {
            return (
              <div
                key={item.name}
                className={commonClass}
                onClick={() => router.push(item.path)}
              >
                <span>{item.name}</span>
                <RightArrow size={20} className="w-5 h-5 stroke-gray-400" />
              </div>
            );
          }

          if (item.type === "modal") {
            return (
              <DialogButton
                key={item.name}
                title={item.modalProps.title}
                content={item.modalProps.content}
                open={activeDialog === item.name}
                onClose={() => setActiveDialog(null)}
                onAction={() => {
                  item.modalProps.onAction();
                  setActiveDialog(null);
                }}
              >
                <div
                  className={commonClass}
                  onClick={() => setActiveDialog(item.name)}
                >
                  <span>{item.name}</span>
                  <RightArrow className="w-5 h-5 stroke-gray-400" />
                </div>
              </DialogButton>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
