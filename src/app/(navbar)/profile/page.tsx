"use client";
import DoughnutChart from "@/components/chart/DoughnutChart";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";
import Button from "@/components/common/button/Button";
import DialogButton from "@/components/common/button/DialogButton";
import { DislikeButton } from "@/components/common/button/ReactionButton";
import RightArrow from "@/assets/icons/right_arrow_icon.svg";
import ProfileCardDetail from "@/components/profile/ProfileCardDetail";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/common/Header";
import { useUserProfileQuery } from "@/hooks/useUserProfileQuery";
import Image from "next/image";
import {
  CategoryRatios,
  PairingAnswer,
  ConsumeHistory,
  UserProfile,
  goalUtils,
  GoalPeriod,
  GoalType,
  IdealIncomeRangeLabelMap,
} from "@/app/types/profiles";

const emptyCategoryRatios = {
  SAVINGS: 0,
  DOMESTIC_STOCKS: 0,
  DEVELOPED_STOCKS: 0,
  EMERGING_STOCKS: 0,
  DOMESTIC_BONDS: 0,
  FOREIGN_BONDS: 0,
  ALTERNATIVE: 0,
  CASH: 0,
};

const emptyConsumeHistory = {
  savingsRate: 0,
  investmentRate: 0,
  leisureRate: 0,
  livingExpenseRate: 0,
  otherRate: 0,
};

function getUser(data: UserProfile | undefined) {
  if (!data) {
    return {
      id: 0,
      name: "이름 없음",
      age: 0,
      job: "직업 정보 없음",
      location: "지역 정보 없음",
      description: "소개 정보 없음",
      imageUrl: "/jennie.jpg",
      target: "목표 없음",
      totalAsset: "0원",
      carCost: "0원",
      houseCost: "0원",
      portfolioRatios: emptyCategoryRatios as CategoryRatios,
      debtPercent: "0%",
      investorType: "정보 없음",
      portfolioType: "정보 없음",
    };
  }
  return {
    id: data.userId,
    name: data.nickname || "이름 없음",
    age: new Date().getFullYear() - (data.birthYear || 2000),
    job: data.job || "직업 정보 없음",
    location: data.city || "지역 정보 없음",
    description: data.description || "소개 정보 없음",
    imageUrl: data.profileImage || "/jennie.jpg",
    target:
      (goalUtils.periodValueToOption(data.goalPeriod as GoalPeriod) || "") +
      " " +
      (goalUtils.enumToTag(data.goalType as GoalType) || "") +
      "!",
    totalAsset: data.totalAsset
      ? `${(data.totalAsset / 10000).toLocaleString()}만원`
      : "0원",
    carCost: data.carValue
      ? `${(data.carValue / 10000).toLocaleString()}만원`
      : "0원",
    houseCost: data.houseValue
      ? `${(data.houseValue / 10000).toLocaleString()}만원`
      : "0원",
    portfolioRatios: (data.categoryRatios ||
      emptyCategoryRatios) as CategoryRatios,
    debtPercent: `${data.financialProductRatio?.loanRatio}%` || "0%",
    investorType: data.currentType || "정보 없음",
    portfolioType: data.preferredType || "정보 없음",
  };
}

function getConsumeHistory(data: UserProfile | undefined): ConsumeHistory {
  return data?.consumeHistory || emptyConsumeHistory;
}

function getPairingAnswers(pairingAnswerData: PairingAnswer | undefined) {
  if (!pairingAnswerData) return [];
  return [
    {
      id: 1,
      answer: `${(pairingAnswerData.carBudget / 10000).toLocaleString()}만원, ${(pairingAnswerData.dateBudget / 10000).toLocaleString()}만원, ${(pairingAnswerData.shoesBudget / 10000).toLocaleString()}만원`,
    },
    {
      id: 2,
      answer: `${pairingAnswerData.preferredCity || ""}`,
    },
    {
      id: 3,
      answer: `${IdealIncomeRangeLabelMap[pairingAnswerData.idealIncomeRange] || ""}`,
    },
  ];
}

export default function MyPage() {
  const { data } = useUserProfileQuery();

  const user = getUser(data?.data);
  const consumeHistoryData = getConsumeHistory(data?.data);
  const answer = getPairingAnswers(data?.data?.pairingAnswer);
  const router = useRouter();

  const [showCard, setShowCard] = useState(false);

  const [activeDialog, setActiveDialog] = useState<string | null>(null);

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
          console.log("로그아웃 처리");
          router.push("/login");
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
          console.log("탈퇴 처리");
          router.push("/login");
        },
      },
    },
  ];

  // const handleLogoutAction = () => {
  //   // 실제 로그아웃 처리 로직 (API 호출 등)
  //   console.log("로그아웃 처리 실행!");
  //   router.push("/login"); // 예시: 로그인 페이지로 이동
  // };

  // const handleWithdrawAction = () => {
  //   // 실제 회원탈퇴 처리 로직 (API 호출 등)
  //   console.log("회원탈퇴 처리 실행!");
  //   // API 호출 후 성공 시 라우팅
  //   router.push("/login"); // 예시: 로그인 페이지로 이동
  // };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5 px-5 py-2">
        <Header title="마이페이지" />
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
                    showDetail={true}
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
      {/* 메뉴 리스트 부분 */}
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
                <RightArrow size={20} className="text-gray-400" />
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
                  <RightArrow size={20} className="text-gray-400" />
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
