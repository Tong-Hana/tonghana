// services/matchCards/matchCardListService.ts
import { replicaPrisma } from "@/lib/prisma/replicaClient";

type SubjectResponse = {
  subjectId: number;
  subjectType: string;
  title: string;
  description: string;
  features: string;
  period: string;
  interestRate: string;
  subjectUrl: string | null;
};

type FinancialProduct = {
  currentValue: bigint | number | null;
  financialProduct: {
    category: string;
  };
};

type Loan = {
  loanBalance: bigint | number | null;
};

type UserWithFinanceData = {
  carValue: number | null;
  houseValue: number | null;
  userFinancialProduct: FinancialProduct[];
  loan: Loan[];
};

export async function getTodayRecoUserIds(
  baseUserId: number,
): Promise<number[]> {
  const rawUserIds = await replicaPrisma.userRecoLog.findMany({
    where: {
      baseUserId,
      likeStatus: false,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)), // 오늘 날짜의 시작 시간
        lt: new Date(new Date().setHours(23, 59, 59, 999)), // 오늘 날짜의 끝 시간
      },
    },
    select: {
      candidateId: true,
    },
  });
  return rawUserIds.map((log) => log.candidateId).sort();
}

export async function getRandomSubject(): Promise<SubjectResponse | undefined> {
  const [subject] = await replicaPrisma.$queryRaw<SubjectResponse[]>`
      SELECT 
        subject_id as subjectId,
        subject_type as subjectType,
        title,
        description,
        features,
        period,
        amount,
        interest_rate as interestRate,
        subject_url as subjectUrl
      FROM Subject
      WHERE subject_type != '금융상식'
      ORDER BY RAND()
      LIMIT 1
    `;
  return subject;
}

export function calculateRatios(user: UserWithFinanceData) {
  // 금융상품 총액(LOAN 제외)
  const financeTotal = user.userFinancialProduct.reduce(
    (acc, p) => acc + Number(p.currentValue ?? 0),
    0,
  );

  // 대출 총액(부채)
  const loanTotal = user.loan.reduce(
    (acc, l) => acc + Number(l.loanBalance ?? 0),
    0,
  );
  // 실물자산 포함한 총합 계산
  const carValue = Number(user.carValue ?? 0);
  const houseValue = Number(user.houseValue ?? 0);
  // 순자산(총자산) 계산
  const totalAssetBase = carValue + houseValue + financeTotal || 1;

  // 금융자산/순자산(금융자산비율), 대출총액/순자산(부채비율) 계산
  const financialProductRatio = {
    financeRatio: parseFloat((financeTotal / totalAssetBase).toFixed(2)),
    loanRatio: parseFloat((loanTotal / totalAssetBase).toFixed(2)),
  };

  // 카테고리별 자산 비율 계산
  const categorySums: Record<string, number> = {};
  for (const p of user.userFinancialProduct) {
    const category = p.financialProduct.category;
    const value = Number(p.currentValue ?? 0);
    categorySums[category] = (categorySums[category] ?? 0) + value;
  }

  const entries = Object.entries(categorySums).map(([key, value]) => {
    const ratio = parseFloat((value / financeTotal).toFixed(2));
    return { key, ratio };
  });

  // 마지막 카테고리 보정
  const sum = entries.reduce((acc, { ratio }) => acc + ratio, 0);
  const diff = parseFloat((1 - sum).toFixed(2));
  if (entries.length > 0) {
    entries[entries.length - 1].ratio = parseFloat(
      (entries[entries.length - 1].ratio + diff).toFixed(2),
    );
  }

  // 전체 카테고리 기본값 + 비율 합성
  const categoryRatios = {
    SAVINGS: 0,
    DOMESTIC_STOCKS: 0,
    DEVELOPED_STOCKS: 0,
    EMERGING_STOCKS: 0,
    DOMESTIC_BONDS: 0,
    FOREIGN_BONDS: 0,
    ALTERNATIVE: 0,
    CASH: 0,
    ...Object.fromEntries(entries.map(({ key, ratio }) => [key, ratio])),
  };

  return { financialProductRatio, categoryRatios };
}
