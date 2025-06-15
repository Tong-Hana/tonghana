import Header from "@/components/common/Header";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function CardDetailLayout({
  children,
  params,
}: LayoutProps) {
  const userId = Number(params.id);

  // const user = await fetchUserData(userId)

  const user = {
    id: userId,
    name: "김하나",
    age: 30,
    job: "회사원",
    location: "경기도 성남시",
    description: "성남에 살고 서울에서 일해요 😊",
    imageUrl: "/jennie.jpg",
    target: "5년 안에 내집마련!",
    totalAsset: "5억",
    carCost: "5천만원",
    houseCost: "3억",
    portfolioValues: [300, 200, 165, 100, 0, 0, 0, 100],
    debtPercent: "200%",
    investorType: "적극투자",
    portfolioType: "안정형",
    showDetail: false,
  };

  const headerTitle = user ? `${user.name}` : "카드 상세";

  return (
    <div>
      <Header title={headerTitle} centerTitle={true} showBackButton={true} />
      <div className="pb-[1rem]" />
      {children}
      <div className="pb-[5rem]" />
    </div>
  );
}
