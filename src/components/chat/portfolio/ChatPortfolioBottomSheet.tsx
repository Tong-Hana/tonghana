import ChatPortfolio from "./ChatPortfolio";
import {
  categoryKeys,
  CategoryRatios,
  PortfolioCategoryColorMap,
  PortfolioCategoryLabelMap,
} from "@/app/types/profile";
import BottomSheet from "@/components/common/BottomSheet";

type Props = {
  open: boolean;
  partnerNickname?: string;
  myPortfolioData: CategoryRatios;
  partnerPortfolioData: CategoryRatios;
  onClose: () => void;
};

export default function ChatPortfolioBottomSheet({
  open,
  partnerNickname,
  myPortfolioData,
  partnerPortfolioData,
  onClose,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="w-full px-5">
        {/* 바텀시트 라벨 */}
        <h2 className="my-5 text-xl text-text-primary text-center font-semibold">
          포트폴리오 비교하기
        </h2>
        {/* 바텀시트 내용 */}
        <div className="flex-grow overflow-y-auto bg-white mb-24">
          {/* 포트폴리오 차트 */}
          <div className="flex mb-8 justify-evenly">
            <div className="flex flex-col items-center gap-2">
              <p className="text-text-primary text-base font-semibold">나</p>
              <ChatPortfolio values={myPortfolioData} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-text-primary text-base font-semibold">
                {partnerNickname ?? "상대방"}
              </p>
              <ChatPortfolio values={partnerPortfolioData} />
            </div>
          </div>
          {/* 포트폴리오 내용 */}
          <div className="px-5">
            <div className="pb-1 mb-2 flex items-center border-b border-b-hanagreen-light font-semibold text-text-primary">
              <div className="w-44">자산유형</div>
              <p className="flex-1 text-end">나</p>
              <p className="flex-1 text-end">상대방</p>
            </div>
            {myPortfolioData &&
              partnerPortfolioData &&
              categoryKeys.map((category, idx) => {
                const typedCategory = category as keyof CategoryRatios;
                return (
                  <div key={idx} className="flex text-text-primary">
                    <div className="flex w-44 justify-start items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            PortfolioCategoryColorMap[typedCategory],
                        }}
                      />
                      <span>{PortfolioCategoryLabelMap[typedCategory]}</span>
                    </div>
                    <p className="flex-1 text-end">
                      {myPortfolioData[typedCategory] ?? 0}%
                    </p>
                    <p className="flex-1 text-end">
                      {partnerPortfolioData[typedCategory] ?? 0}%
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
