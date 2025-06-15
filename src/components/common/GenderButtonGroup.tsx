import { AttentionStarBoy, AttentionStarGirl } from "@/assets/assets";
import clsx from "clsx";

export type Gender = "M" | "F";

type Props = {
  selectedGender: Gender | null;
  onSelect: (gender: Gender) => void;
};

type ButtonProps = {
  gender: Gender;
  isSelected: boolean;
  onSelect: () => void;
};

const GenderButton = ({ gender, isSelected, onSelect }: ButtonProps) => {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onSelect}
        className={clsx(
          "flex flex-col p-3 rounded-2xl border",
          isSelected
            ? "border-hanagreen-normal bg-hanagreen-light-active"
            : "border-hanasilver",
        )}
      >
        {gender === "M" ? (
          <AttentionStarBoy className="w-20 h-20" />
        ) : (
          <AttentionStarGirl className="w-20 h-20" />
        )}
      </button>
      <label className="text-text-primary mt-3">
        {gender === "M" ? "남자" : "여자"}
      </label>
    </div>
  );
};

export default function GenderButtonGroup({ selectedGender, onSelect }: Props) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-3 text-xs font-normal text-text-secondary">
        성별
      </label>
      <div className="flex justify-center gap-6">
        <GenderButton
          gender="M"
          isSelected={selectedGender === "M"}
          onSelect={() => onSelect("M")}
        />
        <GenderButton
          gender="F"
          isSelected={selectedGender === "F"}
          onSelect={() => onSelect("F")}
        />
      </div>
    </div>
  );
}
