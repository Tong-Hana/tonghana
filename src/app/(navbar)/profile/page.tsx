"use client";
import DoughnutChart from "@/components/chart/DoughnutChart";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";
import Button from "@/components/common/button/Button";
import ImageUploader from "@/components/profile/imageUploader/ImageUploader";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  // const pairingAnswerData = {
  //   id: 1,
  //   user_id: 1,
  //   car_budget: 50000000,
  //   date_budget: 300000,
  //   shoes_budget: 200000,
  //   preferred_city: "서울시",
  //   preferred_district: "압구정동",
  //   ideal_income_range: "1000만원대 이상",
  //   created_at: "2023-01-01T10:00:00Z",
  // };
  // const answer = [
  //   {
  //     id: 1,
  //     answer: `${(pairingAnswerData.car_budget / 10000).toLocaleString()}만원, ${(pairingAnswerData.date_budget / 10000).toLocaleString()}만원, ${(pairingAnswerData.shoes_budget / 10000).toLocaleString()}만원`,
  //   },
  //   {
  //     id: 2,
  //     answer: `${pairingAnswerData.preferred_city} ${pairingAnswerData.preferred_district}`,
  //   },
  //   {
  //     id: 3,
  //     answer: `${pairingAnswerData.ideal_income_range}`,
  //   },
  // ];

  const router = useRouter();

  const menuItems = [
    { name: "내 정보 수정하기", path: "/profile/edit" },
    { name: "FTTI 설문 다시하기", path: "/profile/ftti" },
    { name: "로그아웃", path: "/login" },
    { name: "회원탈퇴", path: "/login" },
  ];

  const [setShowCard] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-5 px-5 py-2">
        <div className="flex justify-center items-center gap-9 px-5">
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
            valueFormat="currency"
          />
        </div>

        <MonthlySpendingChart segments={segments} />
      </div>
      {/* 새롭게 추가될 메뉴 리스트 부분 */}
      <div className="bg-white mt-4 shadow-sm">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-4 py-4 cursor-pointer text-text-primary text-base font-normal border-t border-gray-200 last:border-b-0"
            onClick={() => router.push(item.path)}
          >
            <span>{item.name}</span>
            {/* 오른쪽 화살표 아이콘 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
