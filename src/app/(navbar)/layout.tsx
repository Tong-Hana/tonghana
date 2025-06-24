import BottomNav from "@/components/common/navbar/BottomNav";

export default function BottomNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen">
      <div className="px-5 h-full">{children}</div>
      <BottomNav />
    </div>
  );
}
