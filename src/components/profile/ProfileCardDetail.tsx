import ProfileCard from "@/components/profile/ProfileCard";
import PairingBook from "@/components/profile/ParingBook";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";
import { ProfileCardProps } from "./types/profileCardTypes";

interface ProfileCardDetailProps {
  user: ProfileCardProps;
  answers: { id: number; answer: string }[];
  segments: { label: string; value: number }[];
}

export default function ProfileCardDetail({
  user,
  answers,
  segments,
}: ProfileCardDetailProps) {
  return (
    <>
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
      <div className="flex flex-col justify-center w-full mt-4 gap-4">
        {/* paringbook */}
        <PairingBook answers={answers} />
        {/* 지난 달 소비 */}
        <MonthlySpendingChart segments={segments} />
      </div>
    </>
  );
}
