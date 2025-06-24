import { Chart } from "@/assets/assets";

type Props = {
  onOpen: () => void;
};

export default function ChatPortfolioButton({ onOpen }: Props) {
  return (
    <>
      <button
        className="absolute left-4 -top-1.5 w-fit bg-hanagreen-light hover:bg-hanagreen-light-hover rounded-full p-2 shadow-xl"
        type="button"
        onClick={onOpen}
      >
        <Chart className="w-8 h-8" />
      </button>
    </>
  );
}
