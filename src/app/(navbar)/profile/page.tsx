"use client";
import DoughnutChart from "@/components/chart/DoughnutChart";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";
import Button from "@/components/common/button/Button";
import DialogButton from "@/components/common/button/DialogButton";
import { DislikeButton } from "@/components/common/button/ReactionButton";
import RightArrow from "@/assets/icons/right_arrow_icon.svg";
import ImageUploader from "@/components/profile/imageUploader/ImageUploader";
import ProfileCardDetail from "@/components/profile/ProfileCardDetail";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/common/Header";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// // API 호출 함수들
// async function fetchUserProfile() {
//   const response = await fetch("/api/profile");
//   if (!response.ok) {
//     throw new Error("Failed to fetch profile");
//   }
//   return response.json();
// }

// async function updateUserProfile(data: any) {
//   const response = await fetch("/api/profile", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error("Failed to update profile");
//   }
//   return response.json();
// }

export default function MyPage() {
  // API로 불러올 데이터
  const user = {
    id: 1,
    name: "김하나",
    age: 30,
    job: "회사원",
    location: "경기도 성남시",
    description: "성남에 살고 서울에서 일해요 😊",
    imageUrl: "/jennie.jpg",
    target: "5년 안에 내집마련!",
    totalAsset: "5억",
    carCost: "5천만원",
    houseCost: "3억",
    portfolioValues: [300, 200, 165, 100, 0, 0, 0, 100],
    debtPercent: "200%",
    investorType: "적극투자",
    portfolioType: "안정형",
    showDetail: false,
  };

  const consumeHistoryData = {
    user_id: 1,
    savings_rate: 0.3,
    investment_rate: 0.2,
    leisure_rate: 0.15,
    living_expense_rate: 0.25,
    other_rate: 0.1,
  };
  const segments = [
    { label: "저축", value: consumeHistoryData.savings_rate * 100 },
    { label: "투자", value: consumeHistoryData.investment_rate * 100 },
    { label: "여가/취미", value: consumeHistoryData.leisure_rate * 100 },
    { label: "생활", value: consumeHistoryData.living_expense_rate * 100 },
    { label: "기타", value: consumeHistoryData.other_rate * 100 },
  ];

  const pairingAnswerData = {
    id: 1,
    user_id: 1,
    car_budget: 50000000,
    date_budget: 300000,
    shoes_budget: 200000,
    preferred_city: "서울시",
    preferred_district: "압구정동",
    ideal_income_range: "1000만원대 이상",
    created_at: "2023-01-01T10:00:00Z",
  };
  const answer = [
    {
      id: 1,
      answer: `${(pairingAnswerData.car_budget / 10000).toLocaleString()}만원, ${(pairingAnswerData.date_budget / 10000).toLocaleString()}만원, ${(pairingAnswerData.shoes_budget / 10000).toLocaleString()}만원`,
    },
    {
      id: 2,
      answer: `${pairingAnswerData.preferred_city} ${pairingAnswerData.preferred_district}`,
    },
    {
      id: 3,
      answer: `${pairingAnswerData.ideal_income_range}`,
    },
  ];

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
        <div className="flex justify-center items-center gap-9 pt-5">
          <ImageUploader imageUrl={user.imageUrl} onChange={() => {}} />
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
                    segments={segments}
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
            values={user.portfolioValues}
            portfolioType={user.portfolioType}
            debtLabel={user.debtPercent}
            showPercent={true}
          />
        </div>

        <MonthlySpendingChart segments={segments} />
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
