import { calculateFttiScore } from "@/utils/calculateFttiScore";

describe("calculateFttiScore", () => {
  it("calculates totalScore and resultType correctly", () => {
    const answers = [1, 2, 1, [2, 3], 2, 2, 3, 4];
    const { totalScore, resultType } = calculateFttiScore(answers);

    expect(totalScore).toBeGreaterThan(0); // 점수가 0보다 커야 하고
    expect(resultType).toBeDefined(); // 결과 타입(resultType)이 undefined가 아니어야 함 (에러 방지)
  });

  it("returns CONSERVATIVE for specific conditions", () => {
    const answers = [6, 1, 1, [1], 1, 3, 1, 1];
    const { resultType } = calculateFttiScore(answers);

    expect(resultType).toBe("CONSERVATIVE");
  });

  it("returns VERY_AGGRESSIVE for high totalScore", () => {
    const answers = [1, 5, 1, [5], 1, 4, 1, 1];
    const { resultType } = calculateFttiScore(answers);

    expect(resultType).toBe("VERY_AGGRESSIVE");
  });
});
