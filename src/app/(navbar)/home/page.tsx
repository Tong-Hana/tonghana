"use client";
import HanaAdCard from "@/components/advertisement/HanaAdCard";
import ProfileCard from "@/components/profile/ProfileCard";
import React from "react";

export default function HomePage() {
  // 나중에 API 응답으로 받아올 사용자, 광고 데이터
  const users = [
    {
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
    },
    {
      id: 2,
      name: "이두나",
      age: 28,
      job: "프리랜서 디자이너",
      location: "서울시 강남구",
      description: "감각적인 디자인을 추구합니다 ✨",
      imageUrl: "/jennie.jpg",
      target: "나만의 스튜디오 열기!",
      totalAsset: "2억",
      carCost: "3천만원",
      houseCost: "1억",
      portfolioValues: [100, 50, 80, 20, 0, 0, 0, 0],
      debtPercent: "50%",
      investorType: "안정형",
      portfolioType: "성장형",
      showDetail: true,
    },
    {
      id: 3,
      name: "박세븐",
      age: 35,
      job: "개발자",
      location: "서울시 마포구",
      description: "커피와 코딩을 사랑하는 개발자입니다 ☕",
      imageUrl: "/jennie.jpg",
      target: "글로벌 서비스 런칭!",
      totalAsset: "10억",
      carCost: "8천만원",
      houseCost: "5억",
      portfolioValues: [400, 300, 200, 150, 0, 0, 0, 0],
      debtPercent: "150%",
      investorType: "모험투자",
      portfolioType: "공격형",
      showDetail: false,
    },
    {
      id: 4,
      name: "사용자4",
      age: 22,
      job: "학생",
      location: "부산",
      description: "설명4",
      imageUrl: "/jennie.jpg",
      target: "목표4",
      totalAsset: "1억",
      carCost: "1천만원",
      houseCost: "0",
      portfolioValues: [10, 20, 30, 40, 0, 0, 0, 0],
      debtPercent: "10%",
      investorType: "안정형",
      portfolioType: "안정형",
      showDetail: false,
    },
    {
      id: 5,
      name: "사용자5",
      age: 23,
      job: "직장인",
      location: "대구",
      description: "설명5",
      imageUrl: "/jennie.jpg",
      target: "목표5",
      totalAsset: "2억",
      carCost: "2천만원",
      houseCost: "5천만원",
      portfolioValues: [20, 30, 40, 10, 0, 0, 0, 0],
      debtPercent: "20%",
      investorType: "모험투자",
      portfolioType: "성장형",
      showDetail: true,
    },
    {
      id: 6,
      name: "사용자6",
      age: 24,
      job: "자영업",
      location: "인천",
      description: "설명6",
      imageUrl: "/jennie.jpg",
      target: "목표6",
      totalAsset: "3억",
      carCost: "3천만원",
      houseCost: "1억",
      portfolioValues: [30, 40, 10, 20, 0, 0, 0, 0],
      debtPercent: "30%",
      investorType: "적극투자",
      portfolioType: "공격형",
      showDetail: false,
    },
    {
      id: 7,
      name: "사용자7",
      age: 25,
      job: "공무원",
      location: "광주",
      description: "설명7",
      imageUrl: "/jennie.jpg",
      target: "목표7",
      totalAsset: "4억",
      carCost: "4천만원",
      houseCost: "2억",
      portfolioValues: [40, 10, 20, 30, 0, 0, 0, 0],
      debtPercent: "40%",
      investorType: "안정형",
      portfolioType: "안정형",
      showDetail: true,
    },
    {
      id: 8,
      name: "사용자8",
      age: 26,
      job: "의사",
      location: "대전",
      description: "설명8",
      imageUrl: "/jennie.jpg",
      target: "목표8",
      totalAsset: "5억",
      carCost: "5천만원",
      houseCost: "3억",
      portfolioValues: [10, 20, 30, 40, 0, 0, 0, 0],
      debtPercent: "50%",
      investorType: "모험투자",
      portfolioType: "성장형",
      showDetail: false,
    },
    {
      id: 9,
      name: "사용자9",
      age: 27,
      job: "변호사",
      location: "울산",
      description: "설명9",
      imageUrl: "/jennie.jpg",
      target: "목표9",
      totalAsset: "6억",
      carCost: "6천만원",
      houseCost: "4억",
      portfolioValues: [20, 30, 40, 10, 0, 0, 0, 0],
      debtPercent: "60%",
      investorType: "적극투자",
      portfolioType: "공격형",
      showDetail: true,
    },
    {
      id: 10,
      name: "사용자10",
      age: 28,
      job: "교사",
      location: "세종",
      description: "설명10",
      imageUrl: "/jennie.jpg",
      target: "목표10",
      totalAsset: "7억",
      carCost: "7천만원",
      houseCost: "5억",
      portfolioValues: [30, 40, 10, 20, 0, 0, 0, 0],
      debtPercent: "70%",
      investorType: "안정형",
      portfolioType: "안정형",
      showDetail: false,
    },
  ];

  const ads = [
    {
      id: 1,
      name: "하나 청년도약계좌",
      interest_rate: 4.5,
      max_interest_rate: 6.0,
      max_amount: 50000000,
    },
    {
      id: 2,
      name: "하나 이끌림 대출",
      interest_rate: 3.2,
      max_interest_rate: 5.5,
      max_amount: 100000000,
    },
    {
      id: 3,
      name: "하나 자산관리 서비스",
      interest_rate: 5.0,
      max_interest_rate: 7.0,
      max_amount: 200000000,
    },
  ];

  return (
    <div className="frame-container space-y-8">
      <div className="flex flex-col gap-5">
        {users.map((user, index) => {
          // 광고 인덱스
          const adIndex = (Math.floor((index + 1) / 9) - 1) % ads.length;
          const currentAd = ads[adIndex]; // 현재 렌더링할 광고 데이터

          return (
            <React.Fragment key={user.id}>
              <ProfileCard
                id={user.id}
                name={user.name}
                age={user.age}
                job={user.job}
                location={user.location}
                description={user.description}
                imageUrl={user.imageUrl}
                target={user.target}
                totalAsset={user.totalAsset}
                carCost={user.carCost}
                houseCost={user.houseCost}
                portfolioValues={user.portfolioValues}
                debtPercent={user.debtPercent}
                investorType={user.investorType}
                portfolioType={user.portfolioType}
                showDetail={user.showDetail}
              />
              {(index + 1) % 9 === 0 && ads.length > 0 && (
                <HanaAdCard
                  key={`ad-${currentAd.id}`}
                  name={currentAd.name}
                  interestRate={currentAd.interest_rate}
                  maxInterestRate={currentAd.max_interest_rate}
                  maxAmount={currentAd.max_amount}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
