import Header from "@/components/common/Header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="마이페이지" centerTitle={false} showBackButton={false} />
      {children}
    </div>
  );
}
