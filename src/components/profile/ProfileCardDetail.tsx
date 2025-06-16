import ProfileCard from "./ProfileCard";
import PairingBook from "./ParingBook";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";

export default function ProfileCardDetail() {
  const answer = [
    { id: 1, answer: "5000만원, 30만원, 20만원" },
    { id: 2, answer: "서울시 압구정동" },
    { id: 3, answer: "1000만원대 이상" },
  ];

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

  const segments = [
    { label: "저축", value: 30 },
    { label: "투자", value: 20 },
    { label: "여가/취미", value: 15 },
    { label: "생활", value: 25 },
    { label: "기타", value: 10 },
  ];

  return (
    <div className="flex flex-col justify-center p-3 w-full rounded-xl bg-hanagreen-light border-hanagreen-light-active border gap-4">
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
      {/* paringbook */}
      <PairingBook answers={answer} />
      {/* 지난 달 소비 */}
      <MonthlySpendingChart segments={segments} />
    </div>
  );
}
