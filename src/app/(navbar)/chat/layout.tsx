import Header from "@/components/common/Header";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="채팅" centerTitle={false} showBackButton={false} />
      {children}
    </div>
  );
}
