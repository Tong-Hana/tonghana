import Header from "@/components/common/Header";

export default function LikeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="받은 좋아요" centerTitle={false} showBackButton={false} />
      {children}
    </div>
  );
}
