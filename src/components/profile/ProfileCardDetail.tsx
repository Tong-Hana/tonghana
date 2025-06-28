import ProfileCard from "@/components/profile/ProfileCard";
import PairingBook from "@/components/profile/ParingBook";
import MonthlySpendingChart from "@/components/chart/MonthlySpendingChart";
import { ProfileCardProps } from "./types/profileCardTypes";
import { ConsumeHistory } from "@/app/types/profiles";

interface ProfileCardDetailProps {
  user: ProfileCardProps;
  answers: { id: number; answer: string }[];
  data: ConsumeHistory;
  modalView?: boolean;
}

export default function ProfileCardDetail({
  user,
  answers,
  data,
  modalView = false,
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
        hasCar={user.hasCar}
        hasHouse={user.hasHouse}
        carCost={user.carCost}
        houseCost={user.houseCost}
        portfolioRatios={user.portfolioRatios}
        badges={user.badges}
        debtPercent={user.debtPercent}
        investorType={user.investorType}
        portfolioType={user.portfolioType}
        modalView={modalView}
      />
      <div className="flex flex-col justify-center w-full mt-4 gap-4">
        {/* paringbook */}
        <PairingBook answers={answers} />
        {/* 지난 달 소비 */}
        <MonthlySpendingChart data={data} />
      </div>
    </>
  );
}
