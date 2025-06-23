import { Chart } from "@/assets/assets";
import { useState } from "react";
import ChatPortfolioBottomSheet from "./ChatPortfolioBottomSheet";
import { CategoryRatios } from "@/app/types/profile";

type Props = {
  partnerNickname?: string;
  myPortfolioData: CategoryRatios;
  partnerPortfolioData: CategoryRatios;
};

export default function ChatPortfolioButton({
  partnerNickname,
  myPortfolioData,
  partnerPortfolioData,
}: Props) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  return (
    <>
      <button
        className="absolute left-4 -top-1.5 w-fit bg-hanagreen-light hover:bg-hanagreen-light-hover rounded-full p-2 shadow-xl"
        type="button"
        onClick={() => setShowBottomSheet(true)}
      >
        <Chart className="w-8 h-8" />
      </button>
      <ChatPortfolioBottomSheet
        open={showBottomSheet}
        partnerNickname={partnerNickname}
        myPortfolioData={myPortfolioData}
        partnerPortfolioData={partnerPortfolioData}
        onClose={() => setShowBottomSheet(false)}
      />
    </>
  );
}
