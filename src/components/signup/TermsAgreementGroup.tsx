import { TERMS } from "@/constants/terms";
import LabelWithCheckBox from "../common/LabelWithCheckBox";

type Props = {
  value: Record<string, boolean>;
  onChange: (newValue: Record<string, boolean>) => void;
};

export default function TermsAgreementGroup({ value, onChange }: Props) {
  const allChecked = Object.values(value).every(Boolean);

  const toggleAll = () => {
    const newState = TERMS.reduce(
      (acc, term) => ({ ...acc, [term.id]: !allChecked }),
      {},
    );
    onChange(newState);
  };

  const handleChange = (id: string) => {
    const updated = {
      ...value,
      [id]: !value[id],
    };
    onChange(updated);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 모두 동의 버튼 */}
      <div className="border-b border-hanasilver">
        <LabelWithCheckBox
          id="all"
          label="모두 동의하기"
          checked={allChecked}
          onChange={toggleAll}
        />
      </div>

      {/* 약관 목록 */}

      {TERMS.map((term) => (
        <LabelWithCheckBox
          key={term.id}
          id={term.id}
          label={term.label}
          checked={value[term.id]}
          onChange={() => handleChange(term.id)}
        />
      ))}
    </div>
  );
}
