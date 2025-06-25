// 금융상품 더미데이터 생성

import { ProductCategory, RiskLevel } from "../../src/lib/constants/enums";
import { masterPrisma } from "../../src/lib/prisma/masterClient";

interface FinancialProduct {
  productName: string;
  institutionName: string;
  riskLevel: RiskLevel;
  category: ProductCategory;
}

const categoryInstitutions: Record<ProductCategory, string[]> = {
  SAVINGS: [
    "국민은행",
    "신한은행",
    "우리은행",
    "하나은행",
    "카카오뱅크",
    "토스뱅크",
  ],
  CASH: [
    "국민은행",
    "신한은행",
    "우리은행",
    "하나은행",
    "카카오뱅크",
    "토스뱅크",
  ],
  DOMESTIC_STOCKS: [
    "미래에셋증권",
    "삼성증권",
    "NH투자증권",
    "한국투자증권",
    "하나증권",
  ],
  DEVELOPED_STOCKS: [
    "미래에셋증권",
    "삼성증권",
    "NH투자증권",
    "한국투자증권",
    "하나증권",
  ],
  EMERGING_STOCKS: [
    "미래에셋증권",
    "삼성증권",
    "NH투자증권",
    "한국투자증권",
    "하나증권",
  ],
  DOMESTIC_BONDS: [
    "미래에셋증권",
    "삼성증권",
    "NH투자증권",
    "한국투자증권",
    "하나증권",
  ],
  FOREIGN_BONDS: [
    "미래에셋증권",
    "삼성증권",
    "NH투자증권",
    "한국투자증권",
    "하나증권",
  ],
  ALTERNATIVE: [
    "미래에셋증권",
    "삼성증권",
    "NH투자증권",
    "한국투자증권",
    "하나증권",
  ],
};

const productFeatures: Record<ProductCategory, string[]> = {
  SAVINGS: ["정기예금", "적금"],
  CASH: ["자유입출금", "급여통장"],
  DOMESTIC_STOCKS: ["KOSPI", "KOSDAQ", "KONEX"],
  DEVELOPED_STOCKS: ["미국", "유럽", "일본"],
  EMERGING_STOCKS: ["중국", "인도", "베트남", "브라질"],
  DOMESTIC_BONDS: ["국채", "회사채"],
  FOREIGN_BONDS: ["국채", "회사채"],
  ALTERNATIVE: ["금", "원유", "리츠"],
};

const riskLevelMap: Record<ProductCategory, RiskLevel | RiskLevel[]> = {
  SAVINGS: RiskLevel.VERY_LOW,
  CASH: RiskLevel.VERY_LOW,
  DOMESTIC_STOCKS: RiskLevel.HIGH,
  DEVELOPED_STOCKS: RiskLevel.VERY_HIGH,
  EMERGING_STOCKS: RiskLevel.VERY_HIGH,
  DOMESTIC_BONDS: [
    RiskLevel.VERY_HIGH,
    RiskLevel.HIGH,
    RiskLevel.LITTLE_HIGH,
    RiskLevel.MEDIUM,
    RiskLevel.LOW,
    RiskLevel.VERY_LOW,
  ],
  FOREIGN_BONDS: [
    RiskLevel.VERY_HIGH,
    RiskLevel.HIGH,
    RiskLevel.LITTLE_HIGH,
    RiskLevel.MEDIUM,
    RiskLevel.LOW,
  ],
  ALTERNATIVE: [
    RiskLevel.VERY_HIGH,
    RiskLevel.HIGH,
    RiskLevel.LITTLE_HIGH,
    RiskLevel.MEDIUM,
    RiskLevel.LOW,
  ],
};

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 카테고리에 맞는 금융상품 1개 랜덤 생성 함수
function generateProduct(category: ProductCategory): FinancialProduct {
  const institution = getRandomElement(categoryInstitutions[category]);
  const feature = getRandomElement(productFeatures[category]);
  let riskLevel: RiskLevel;

  if (Array.isArray(riskLevelMap[category])) {
    riskLevel = getRandomElement(riskLevelMap[category] as RiskLevel[]);
  } else {
    riskLevel = riskLevelMap[category] as RiskLevel;
  }

  let productName: string;
  if (category === "SAVINGS" || category === "CASH") {
    productName = `${institution} ${feature}`;
  } else {
    const categoryNameMap: Record<ProductCategory, string> = {
      DOMESTIC_STOCKS: "국내주식",
      DEVELOPED_STOCKS: "선진국주식",
      EMERGING_STOCKS: "신흥국주식",
      DOMESTIC_BONDS: "국내채권",
      FOREIGN_BONDS: "해외채권",
      ALTERNATIVE: "대체투자",
      SAVINGS: "",
      CASH: "",
    };
    const categoryName = categoryNameMap[category] || "";
    productName = `${institution} ${feature} ${categoryName}`;
  }

  return {
    productName,
    institutionName: institution,
    riskLevel,
    category,
  };
}

const categories: ProductCategory[] = [
  ProductCategory.SAVINGS,
  ProductCategory.CASH,
  ProductCategory.DOMESTIC_STOCKS,
  ProductCategory.DEVELOPED_STOCKS,
  ProductCategory.EMERGING_STOCKS,
  ProductCategory.DOMESTIC_BONDS,
  ProductCategory.FOREIGN_BONDS,
  ProductCategory.ALTERNATIVE,
];
const cntMap: Record<ProductCategory, number> = {
  SAVINGS: 9,
  CASH: 9,
  DOMESTIC_STOCKS: 28,
  DEVELOPED_STOCKS: 23,
  EMERGING_STOCKS: 7,
  DOMESTIC_BONDS: 7,
  FOREIGN_BONDS: 4,
  ALTERNATIVE: 13,
};

// 카테고리별로 number 갯수만큼 금융상품 생성
export async function generateFinancialProducts() {
  for (const category of categories) {
    const j = cntMap[category];
    for (let i = 0; i < j; i++) {
      const productData = generateProduct(category);
      await masterPrisma.financialProduct.create({
        data: {
          productName: productData.productName,
          institutionName: productData.institutionName,
          riskLevel: productData.riskLevel,
          category: productData.category,
        },
      });
    }
  }
}
