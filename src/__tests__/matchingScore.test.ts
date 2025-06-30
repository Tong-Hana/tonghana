import {
  calcMutualSimilarity,
  cosineSimilarity,
} from "@/lib/actions/makeMatchPartner";
import { investmentTypeToVector } from "@/lib/actions/saveUserVector";
import { InvestmentType } from "@/lib/constants/enums";

describe("cosineSimilarity test", () => {
  it("should return 1 for identical vectors", () => {
    const result = cosineSimilarity([1, 0, 0], [1, 0, 0]);
    expect(result).toBeCloseTo(1);
  });

  it("should return 0 for orthogonal vectors", () => {
    const result = cosineSimilarity([1, 0], [0, 1]);
    expect(result).toBeCloseTo(0);
  });

  it("should return -1 for opposite vectors", () => {
    const result = cosineSimilarity([1, 0], [-1, 0]);
    expect(result).toBeCloseTo(-1);
  });

  it("should handle non-normalized vectors", () => {
    const result = cosineSimilarity([1, 2], [2, 4]);
    expect(result).toBeCloseTo(1);
  });
});

describe("calcMutualSimilarity test", () => {
  it("returns 1 when both current and preferred are identical", () => {
    const score = calcMutualSimilarity(
      InvestmentType.CONSERVATIVE,
      InvestmentType.CONSERVATIVE,
      InvestmentType.CONSERVATIVE,
      InvestmentType.CONSERVATIVE,
    );
    expect(score).toBeCloseTo(1, 3); // 소수점 3자리까지
  });

  it("returns high similarity when current and preferred are similar", () => {
    const score = calcMutualSimilarity(
      InvestmentType.MODERATE,
      InvestmentType.NEUTRAL,
      InvestmentType.NEUTRAL,
      InvestmentType.MODERATE,
    );
    expect(score).toBeGreaterThan(0.7);
  });

  it("returns low similarity when preferences are far apart", () => {
    const score = calcMutualSimilarity(
      InvestmentType.CONSERVATIVE,
      InvestmentType.CONSERVATIVE,
      InvestmentType.VERY_AGGRESSIVE,
      InvestmentType.VERY_AGGRESSIVE,
    );
    expect(score).toBeLessThan(0.2);
  });

  it("gives higher weight to my preference matching their current (60%)", () => {
    const lowSim = calcMutualSimilarity(
      InvestmentType.CONSERVATIVE,
      InvestmentType.CONSERVATIVE,
      InvestmentType.AGGRESSIVE,
      InvestmentType.VERY_AGGRESSIVE,
    );

    const highSim = calcMutualSimilarity(
      InvestmentType.CONSERVATIVE,
      InvestmentType.VERY_AGGRESSIVE,
      InvestmentType.CONSERVATIVE,
      InvestmentType.CONSERVATIVE,
    );

    expect(highSim).toBeGreaterThan(lowSim);
  });
});

describe("investmentTypeToVector test", () => {
  it("should return a vector of length 5", () => {
    const vector = investmentTypeToVector(InvestmentType.NEUTRAL);
    expect(vector).toHaveLength(5);
  });

  it("should have highest value at the correct center", () => {
    const vector = investmentTypeToVector(InvestmentType.AGGRESSIVE);
    const max = Math.max(...vector);
    expect(vector[3]).toBeCloseTo(max); // AGGRESSIVE = center index 3
  });

  it("should return symmetric gaussian-like vector for center", () => {
    const vector = investmentTypeToVector(InvestmentType.NEUTRAL);
    expect(vector[1]).toBeCloseTo(vector[3]); // symmetric around center (2)
    expect(vector[0]).toBeCloseTo(vector[4]);
  });

  it("should not return all zeros", () => {
    const vector = investmentTypeToVector(InvestmentType.CONSERVATIVE);
    expect(vector.every((v) => v === 0)).toBe(false);
  });
});
