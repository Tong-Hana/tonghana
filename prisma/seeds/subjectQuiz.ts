import { masterPrisma } from "../../src/lib/prisma/masterClient";

export const depositSeed = [
  {
    subjectType: "정기예금",
    title: "하나의 정기예금",
    description:
      "자유롭게 자금관리가 가능한 하나원큐(스마트폰 뱅킹) 전용 정기예금",
    features: "자유로운 자금관리",
    period: "1개월 ~ 5년",
    amount: "1백만원 이상",
    interestRate: "최대 연 2.3%(세전)",
    subjectUrl:
      "https://www.kebhana.com/cont/mall/mall08/mall0801/mall080101/1479088_115126.jsp",
    quiz: [
      {
        question:
          "하나의 정기예금은 계약기간과 가입금액 모두 자유롭게 설정할 수 있다.",
        explanation: "하나의 정기예금은 계약기간 및 가입금액이 자유로워요",
        answer: true,
      },
      {
        question: "하나의 정기예금은 최대 10년까지 가입기간을 정할 수 있다.",
        explanation:
          "하나의 정기예금은 1개월 이상 5년 이내 일단위로 가입기간을 정할 수 있어요",
        answer: false,
      },
      {
        question: "하나의 정기예금은 가입금액이 1백만원 이상이어야 한다.",
        explanation:
          "하나의 정기예금 가입금액은 최소 1백만원 부터 금액을 자유롭게 정할 수 있어요",
        answer: true,
      },
    ],
  },
  {
    subjectType: "정기예금",
    title: "하나은행의 3·6·9 정기예금",
    description:
      "3개월마다, 기쁜 날마다, 고금리의 즐거움을 드립니다. 3개월마다, 기쁜 날마다 언제든지 필요할 때 찾을 수 있고 찾을 땐 언제나 높은 금리의 즐거움까지 누릴 수 있는 정기 예금입니다.",
    features: "중도해지 옵션",
    period: "1년제",
    amount: "1만원 이상",
    interestRate: "최대 연 2.3%(세전)",
    subjectUrl:
      "https://www.kebhana.com/cont/mall/mall08/mall0801/mall080101/1419598_115126.jsp",
    quiz: [
      {
        question:
          "하나은행의 3·6·9 정기예금은 3개월마다 높은 금리로 갈아탈 수 있다.",
        explanation:
          "하나은행의 3·6·9 정기예금은 3개월마다 금리가 변경되어 높은 금리를 누릴 수 있어요",
        answer: true,
      },
      {
        question: "하나은행의 3·6·9 정기예금의 최대 금리는 연 2.3%이다.",
        explanation:
          "하나은행의 3·6·9 정기예금은 1년 만기시 최대 연 2.3%의 금리를 제공해요",
        answer: true,
      },
      {
        question:
          "하나은행의 3·6·9 정기예금의 최소 가입금액은 3백만원 이상이다.",
        explanation:
          "인터넷뱅킹, 스마트폰 뱅킹으로 최소 1만원 이상 원단위로 가입할 수 있어요",
        answer: false,
      },
    ],
  },
  {
    subjectType: "정기예금",
    title: "고단위 플러스(금리확정형)",
    description: "이자 지급 방법도 내 맘대로! 이자 지급 시기도 내 맘대로!",
    features: "이자지급 방법 선택 가능",
    period: "1개월 ~ 5년",
    amount: "1만원 이상",
    interestRate: "최대 연 2.3%(세전)",
    subjectUrl:
      "https://www.kebhana.com/cont/mall/mall08/mall0801/mall080101/1419600_115126.jsp",
    quiz: [
      {
        question:
          "고단위 플러스(금리확정형)는 이자 지급 방법을 선택할 수 없다.",
        explanation:
          "고단위 플러스(금리확정형)는 이자 지급 방법을 선택할 수 있어요",
        answer: false,
      },
      {
        question: "고단위 플러스(금리확정형)는 최대 연 2.3%의 금리를 제공한다.",
        explanation:
          "고단위 플러스(금리확정형)는 5년 만기시 최대 연 2.3%의 금리를 제공해요",
        answer: true,
      },
      {
        question:
          "고단위 플러스(금리확정형)의 최소 가입금액은 1백만원 이상이다.",
        explanation:
          "인터넷뱅킹, 스마트폰 뱅킹으로 최소 1만원 이상 원단위로 가입할 수 있어요",
        answer: false,
      },
    ],
  },
];

export const savingSeed = [
  {
    subjectType: "적금",
    title: "부자씨 적금",
    description:
      "하나원큐 로그인 횟수 & 하나 합 서비스 등록에 따라 우대금리 받고, 적금 모아서 예금으로~ 예금이 모여서 목돈을 제공하는 상품",
    features: "적금을 모아서 예금으로~",
    period: "1년",
    amount: "50만원 이하",
    interestRate: "최대 연 2.00%(세전)",
    subjectUrl:
      "https://www.kebhana.com/cont/mall/mall08/mall0801/mall080102/1486817_115157.jsp",
    quiz: [
      {
        question: "부자씨 적금은 우대금리를 받을 수 있는 조건이 있다.",
        explanation:
          "하나원큐 로그인 횟수와 하나 합 서비스 등록에 따라 우대금리를 받을 수 있어요.",
        answer: true,
      },
      {
        question: "부자씨 적금은 최대 가입금액이 100만원이다.",
        explanation: "부자씨 적금의 최대 가입금액은 50만원이에요.",
        answer: false,
      },
      {
        question: "부자씨 적금의 최대 금리는 연 2.00%(세전)이다.",
        explanation: "최대 연 2.00%(세전)의 금리를 제공해요.",
        answer: true,
      },
    ],
  },
];

export const commonSeed = [
  {
    subjectType: "금융상식",
    title: "펀드",
    description:
      "펀드는 여러 투자자들로부터 자금을 모아 전문가(운용사)가 주식, 채권, 부동산 등 다양한 자산에 투자하는 금융상품입니다. 개인이 직접 투자하는 것보다 리스크가 분산되고, 전문가가 자산을 운용해주는 것이 장점입니다. 펀드는 수익률이 보장되지 않으며, 운용 성과에 따라 수익을 얻거나 손실이 발생할 수도 있습니다. 펀드에는 주식형, 채권형, 혼합형, 부동산형 등 다양한 종류가 있으며, 투자자의 성향에 맞는 상품을 선택하는 것이 중요합니다.",
    features: "",
    period: "",
    amount: "",
    interestRate: "",
    subjectUrl: "https://www.kebhana.com/fund/index.do",
    quiz: [
      {
        question: "펀드는 전문가가 대신 자산을 운용해준다.",
        explanation:
          "펀드는 자산운용 전문가가 여러 자산에 분산 투자해주기 때문에, 투자자가 직접 매매하지 않아도 돼요.",
        answer: true,
      },
      {
        question: "펀드는 예금처럼 원금이 보장된다.",
        explanation:
          "펀드는 투자상품으로, 예금과 달리 원금이 보장되지 않으며 손실이 발생할 수 있어요.",
        answer: false,
      },
      {
        question: "펀드에는 주식형, 채권형, 혼합형 등 다양한 종류가 있다.",
        explanation:
          "펀드는 투자 자산에 따라 여러 종류가 있으며, 투자자의 성향에 따라 선택할 수 있어요.",
        answer: true,
      },
    ],
  },
];

export const loanSeed = [
  {
    subjectType: "대출",
    title: "우량주택전세론",
    description:
      "아파트, 연립, 다세대, 주거용 오피스텔, 공공임대 아파트까지 우량주택전세론으로 내 집처럼 당당하게",
    features: "임차보증금 지원대출",
    period: "최장 3년 1개월",
    amount: "최대 5억원",
    interestRate: "4.0009 ~ 5.787% (수시 변동)",
    subjectUrl:
      "https://www.kebhana.com/cont/mall/mall08/mall0802/mall080201/1420276_115194.jsp?_menuNo=98786",
    quiz: [
      {
        question: "우량주택전세론은 오피스텔에는 적용되지 않는다.",
        explanation: "주거용 오피스텔도 우량주택전세론의 적용 대상이에요.",
        answer: false,
      },
      {
        question: "우량주택전세론의 최대 대출 가능 금액은 5억원이다.",
        explanation: "맞아요! 해당 상품은 최대 5억원까지 대출이 가능합니다.",
        answer: true,
      },
      {
        question: "우량주택전세론의 대출 기간은 5년까지 가능하다.",
        explanation: "대출 기간은 최장 3년 1개월까지 가능해요.",
        answer: false,
      },
    ],
  },
];

export async function createDepositSeed() {
  for (const subject of depositSeed) {
    await masterPrisma.subject.create({
      data: {
        subjectType: subject.subjectType,
        title: subject.title,
        description: subject.description,
        features: subject.features,
        period: subject.period,
        amount: subject.amount,
        interestRate: subject.interestRate,
        subjectUrl: subject.subjectUrl,
        quiz: {
          create: subject.quiz.map((q) => ({
            question: q.question,
            explanation: q.explanation,
            answer: q.answer,
          })),
        },
      },
    });
  }
}

export async function createSavingSeed() {
  for (const subject of savingSeed) {
    await masterPrisma.subject.create({
      data: {
        subjectType: subject.subjectType,
        title: subject.title,
        description: subject.description,
        features: subject.features,
        period: subject.period,
        amount: subject.amount,
        interestRate: subject.interestRate,
        subjectUrl: subject.subjectUrl,
        quiz: {
          create: subject.quiz.map((q) => ({
            question: q.question,
            explanation: q.explanation,
            answer: q.answer,
          })),
        },
      },
    });
  }
}

export async function createCommonSeed() {
  for (const subject of commonSeed) {
    await masterPrisma.subject.create({
      data: {
        subjectType: subject.subjectType,
        title: subject.title,
        description: subject.description,
        features: subject.features,
        period: subject.period,
        amount: subject.amount,
        interestRate: subject.interestRate,
        subjectUrl: subject.subjectUrl,
        quiz: {
          create: subject.quiz.map((q) => ({
            question: q.question,
            explanation: q.explanation,
            answer: q.answer,
          })),
        },
      },
    });
  }
}

export async function createLoanSeed() {
  for (const subject of loanSeed) {
    await masterPrisma.subject.create({
      data: {
        subjectType: subject.subjectType,
        title: subject.title,
        description: subject.description,
        features: subject.features,
        period: subject.period,
        amount: subject.amount,
        interestRate: subject.interestRate,
        subjectUrl: subject.subjectUrl,
        quiz: {
          create: subject.quiz.map((q) => ({
            question: q.question,
            explanation: q.explanation,
            answer: q.answer,
          })),
        },
      },
    });
  }
}
