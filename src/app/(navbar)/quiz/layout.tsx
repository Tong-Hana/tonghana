import Header from "@/components/common/Header";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="오늘의 퀴즈" centerTitle={false} showBackButton={false} />
      {children}
    </>
  );
}
