// __tests__/matchCardListService.test.ts
import { calculateRatios } from "@/services/server/matchCardListService";

describe("calculateRatios", () => {
  it("사용자의 금융자산비율, 부채비율, 금융상품 카테고리별 비율을 정확하게 계산할 수 있다.", () => {
    const mockUser = {
      carValue: 1000,
      houseValue: 2000,
      userFinancialProduct: [
        {
          currentValue: 3000,
          financialProduct: { category: "SAVINGS" },
        },
        {
          currentValue: 1000,
          financialProduct: { category: "DOMESTIC_STOCKS" },
        },
      ],
      loan: [{ loanBalance: 2000 }],
    };

    const { financialProductRatio, categoryRatios } = calculateRatios(mockUser);

    expect(financialProductRatio.financeRatio).toBeCloseTo(0.5714, 2); // 4000 / (1000+2000+3000+1000) = 0.5714
    expect(financialProductRatio.loanRatio).toBeCloseTo(0.2857, 2); // 2000 / 7000 = 0.2857

    expect(categoryRatios.SAVINGS).toBeCloseTo(0.75, 2);
    expect(categoryRatios.DOMESTIC_STOCKS).toBeCloseTo(0.25, 2);
  });

  it("없는 값이 있어도 올바르게 계산할 수 있다.", () => {
    const user = {
      carValue: null,
      houseValue: null,
      userFinancialProduct: [],
      loan: [],
    };

    const { financialProductRatio, categoryRatios } = calculateRatios(user);

    expect(financialProductRatio.financeRatio).toBe(0);
    expect(financialProductRatio.loanRatio).toBe(0);
    expect(Object.values(categoryRatios).every((v) => v === 0)).toBe(true);
  });
});
