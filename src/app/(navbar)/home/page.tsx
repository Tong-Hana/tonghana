"use client";
import ProfileCard from "@/components/profile/ProfileCard";

export default function HomePage() {
  const user = {
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

  return (
    <div className="frame-container space-y-8">
      <div className="flex flex-col">
        <ProfileCard
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
      </div>
    </div>
  );
}
