import Header from "@/components/common/Header";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header
        title="맞춤 상품 추천"
        centerTitle={false}
        showBackButton={false}
      />
      {children}
    </div>
  );
}
