import ProfileCardDetail from "@/components/profile/ProfileCardDetail";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function CardDetailPage({ params }: Params) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);

  // API로 불러올 데이터
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

  const pairingAnswerData = {
    id: 1,
    user_id: 1,
    car_budget: 50000000,
    date_budget: 300000,
    shoes_budget: 200000,
    preferred_city: "서울시",
    preferred_district: "압구정동",
    ideal_income_range: "1000만원대 이상",
    created_at: "2023-01-01T10:00:00Z",
  };

  const consumeHistoryData = {
    user_id: 1,
    savings_rate: 0.3,
    investment_rate: 0.2,
    leisure_rate: 0.15,
    living_expense_rate: 0.25,
    other_rate: 0.1,
  };

  // ProfileCardDetail에 넘겨줄 answer와 segments 데이터 변환
  const answer = [
    {
      id: 1,
      answer: `${(pairingAnswerData.car_budget / 10000).toLocaleString()}만원, ${(pairingAnswerData.date_budget / 10000).toLocaleString()}만원, ${(pairingAnswerData.shoes_budget / 10000).toLocaleString()}만원`,
    },
    {
      id: 2,
      answer: `${pairingAnswerData.preferred_city} ${pairingAnswerData.preferred_district}`,
    },
    {
      id: 3,
      answer: `${pairingAnswerData.ideal_income_range}`,
    },
  ];

  const segments = [
    { label: "저축", value: consumeHistoryData.savings_rate * 100 },
    { label: "투자", value: consumeHistoryData.investment_rate * 100 },
    { label: "여가/취미", value: consumeHistoryData.leisure_rate * 100 },
    { label: "생활", value: consumeHistoryData.living_expense_rate * 100 },
    { label: "기타", value: consumeHistoryData.other_rate * 100 },
  ];

  return (
    <div>
      <ProfileCardDetail user={user} answers={answer} segments={segments} />
    </div>
  );
}
