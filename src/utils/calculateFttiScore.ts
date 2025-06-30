export type FttiAnswers = (number | number[])[];

export type FttiResultType =
  | "CONSERVATIVE"
  | "MODERATE"
  | "NEUTRAL"
  | "AGGRESSIVE"
  | "VERY_AGGRESSIVE";

export interface FttiResult {
  totalScore: number;
  resultType: FttiResultType;
}

const scoreMap: Record<number, Record<number, number>> = {
  1: { 1: 2.5, 2: 2.5, 3: 2.0, 4: 1.5, 5: 1.0, 6: 0.5 },
  2: { 1: 1.0, 2: 2.0, 3: 2.5, 4: 3.0, 5: 3.5 },
  3: { 1: 5.5, 2: 3.5, 3: 1.0 },
  4: { 1: 1.0, 2: 2.5, 3: 3.5, 4: 4.5, 5: 5.5 },
  5: { 1: 5.5, 2: 4.0, 3: 2.5, 4: 1.0 },
  6: { 1: 1.0, 2: 2.0, 3: 3.0, 4: 4.0 },
  7: { 1: 10.0, 2: 8.5, 3: 6.0, 4: 3.0, 5: 1.0 },
  8: { 1: 2.5, 2: 2.0, 3: 1.5, 4: 1.0, 5: 0.5, 6: 2.5 },
};

export function calculateFttiScore(answers: FttiAnswers): FttiResult {
  let totalScore = 0;

  answers.forEach((answer, idx) => {
    const qn = idx + 1;

    if (qn === 4 && Array.isArray(answer)) {
      answer.forEach((choice) => {
        totalScore += scoreMap[qn][choice] || 0;
      });
    } else {
      totalScore += scoreMap[qn][answer as number] || 0;
    }
  });

  totalScore = (totalScore / 39) * 100;

  let resultType: FttiResultType;

  if ((answers[0] === 6 && answers[5] === 3) || answers[6] === 5) {
    resultType = "CONSERVATIVE";
  } else if (totalScore < 43) {
    resultType = "CONSERVATIVE";
  } else if (totalScore < 55) {
    resultType = "MODERATE";
  } else if (totalScore < 68) {
    resultType = "NEUTRAL";
  } else if (totalScore < 81) {
    resultType = "AGGRESSIVE";
  } else {
    resultType = "VERY_AGGRESSIVE";
  }

  return {
    totalScore,
    resultType,
  };
}
