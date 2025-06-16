import Header from "@/components/common/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="통하나" centerTitle={false} showBackButton={false} />
      <div className="pb-[1rem]" />
      {children}
      <div className="pb-[4rem]" />
    </div>
  );
}
