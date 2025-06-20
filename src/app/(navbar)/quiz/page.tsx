"use client";
import HanaAdCard from "@/components/advertisement/HanaAdCard";
import HanaProductListItem from "@/components/advertisement/HanaProductListItem";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const user = {
    id: 1,
    name: "제니",
    investorType: "안전투자형",
  };
  const currentAd = {
    id: 1,
    name: "청년도약계좌",
    interest_rate: 4.5,
    max_interest_rate: 6.0,
    max_amount: 50000000,
  };

  const ads = [
    {
      id: 1,
      name: "급여 하나 월복리 적금",
      interest_rate: 2.95,
      max_interest_rate: 5.25,
      max_amount: 0,
    },
    {
      id: 2,
      name: "하나 청년도약계좌",
      interest_rate: 4.5,
      max_interest_rate: 6.0,
      max_amount: 0,
    },
    {
      id: 3,
      name: "청년 주택드림 청약통장",
      interest_rate: 2.8,
      max_interest_rate: 4.2,
      max_amount: 0,
    },
    {
      id: 4,
      name: "내맘적금",
      interest_rate: 1.8,
      max_interest_rate: 2.3,
      max_amount: 0,
    },
    {
      id: 5,
      name: "주택청약종합저축",
      interest_rate: 0,
      max_interest_rate: 0,
      max_amount: 0,
    },
  ];

  const router = useRouter();

  return (
    <div className="flex flex-col gap-12 p-5 bg-gray-100 h-full overflow-y-scroll">
      <div className="space-y-3 py-5">
        <div className="text-text-primary text-lg font-normal">
          <span className="text-text-primary font-medium">
            {user.investorType}
          </span>
          인 {user.name}님께
          <div className="text-hanagreen-normal text-lg font-medium">
            {currentAd.name}
            <span className="text-text-primary font-normal">
              {" "}
              상품을 추천해요.
            </span>
          </div>
        </div>

        <div className="mt-4">
          <HanaAdCard
            key={`ad-${currentAd.id}`}
            name={currentAd.name}
            interestRate={currentAd.interest_rate}
            maxInterestRate={currentAd.max_interest_rate}
            maxAmount={currentAd.max_amount}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-text-primary text-lg font-medium">
          더 많은 상품들
        </div>
        <div className="space-y-3">
          {ads.map((ad, index) => (
            <HanaProductListItem
              key={ad.id}
              order={index + 1}
              name={ad.name}
              interestRate={ad.interest_rate}
              maxInterestRate={ad.max_interest_rate}
              maxAmount={ad.max_amount}
              onClick={() => router.push(`/recommend/${ad.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
