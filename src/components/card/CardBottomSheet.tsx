import ProfileCardDetail from "../profile/ProfileCardDetail";
import { ProfileCardProps } from "../profile/types/profileCardTypes";
import { ConsumeHistory } from "@/app/types/profiles";
import BottomSheet from "../common/BottomSheet";

type Props = {
  open: boolean;
  user: ProfileCardProps;
  answers: { id: number; answer: string }[];
  data: ConsumeHistory;
  onClose: () => void;
};

export default function CardBottomSheet({
  open,
  user,
  answers,
  data,
  onClose,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* 바텀시트 라벨 */}
      <h2 className="my-4 text-xl text-text-primary text-center font-semibold">
        내 카드보기
      </h2>
      {/* 바텀시트 내용 */}
      <div
        className="flex-1 overflow-y-auto px-5 py-2 bg-white mb-20 scrollbar-hide"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ProfileCardDetail
          user={user}
          answers={answers}
          data={data}
          modalView={true}
        />
      </div>
    </BottomSheet>
  );
}
