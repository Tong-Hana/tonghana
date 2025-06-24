import Button from "@/components/common/button/Button";

export default function QuizAnswerModal({
  title,
  content,
  open,
  onAction,
  onClose,
  isEnd,
  isCorrect,
}: {
  title: string;
  content: string;
  open?: boolean;
  onAction: () => void;
  onClose: () => void;
  isEnd: boolean;
  isCorrect: boolean;
}) {
  const showModal = open ?? true;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleBackdropClick}
        >
          <div className="rounded-3xl border border-background bg-white mx-5 px-8 pt-6 pb-5 shadow-sm w-full max-w-80">
            <h2 className="mb-4 text-xl font-semibold text-hanagreen-normal">
              {title}
            </h2>

            <p className="mb-6 text-base text-text-primary">{content}</p>

            <div className="flex w-full gap-4 px-0">
              {isEnd || isCorrect ? (
                <></>
              ) : (
                <Button
                  className="rounded-lg"
                  intent="black"
                  size="full"
                  onClick={onClose}
                >
                  그만 두기
                </Button>
              )}
              <Button
                className="rounded-lg"
                intent="green"
                size="full"
                onClick={onAction}
              >
                {isEnd ? "완료" : "다음 문제"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
