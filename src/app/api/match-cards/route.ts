/**
 * @swagger
 * /api/match-cards:
 *   get:
 *     tags:
 *       - MatchCards
 *     summary: 매칭 카드 리스트 조회
 *     description: |
 *       다수의 유저 ID를 기준으로 유저 매칭 카드 리스트를 반환합니다.
 *       각 유저는 기본 정보, 금융상품 카테고리 비율, 부채 비율을 포함하며,
 *       광고를 위한 subjectType이 '금융상식'이 아닌 랜덤 Subject 1개도 함께 포함됩니다.
 *     responses:
 *       200:
 *         description: 매칭 카드 리스트와 랜덤 subject 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 매칭 카드 리스트(15)와 광고(1)를 반환했습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         example: 122
 *                       nickname:
 *                         type: string
 *                         example: 윤성
 *                       gender:
 *                         type: string
 *                         example: M
 *                       birthYear:
 *                         type: integer
 *                         example: 1994
 *                       city:
 *                         type: string
 *                         example: 서울시 성동구
 *                       job:
 *                         type: string
 *                         example: 프리랜서
 *                       description:
 *                         type: string
 *                         example: 안녕하세요. 윤성입니다.
 *                       profileImage:
 *                         type: string
 *                         format: uri
 *                         example: https://avatars.githubusercontent.com/u/21414261
 *                       hasCar:
 *                         type: boolean
 *                         example: false
 *                       hasHouse:
 *                         type: boolean
 *                         example: true
 *                       goalAmount:
 *                         type: integer
 *                         example: 571000000
 *                       goalPeriod:
 *                         type: string
 *                         example: WITHIN_5_YEARS
 *                       goalType:
 *                         type: string
 *                         example: LUMPSUM
 *                       currentType:
 *                         type: string
 *                         example: AGGRESSIVE
 *                       preferredType:
 *                         type: string
 *                         example: MODERATE
 *                       financialProductRatio:
 *                         type: object
 *                         properties:
 *                           financeRatio:
 *                             type: number
 *                             example: 1
 *                           loanRatio:
 *                             type: number
 *                             example: 0
 *                       categoryRatios:
 *                         type: object
 *                         properties:
 *                           SAVINGS:
 *                             type: number
 *                             example: 0.3
 *                           DOMESTIC_STOCKS:
 *                             type: number
 *                             example: 0
 *                           DEVELOPED_STOCKS:
 *                             type: number
 *                             example: 0.33
 *                           EMERGING_STOCKS:
 *                             type: number
 *                             example: 0.06
 *                           DOMESTIC_BONDS:
 *                             type: number
 *                             example: 0.21
 *                           FOREIGN_BONDS:
 *                             type: number
 *                             example: 0
 *                           ALTERNATIVE:
 *                             type: number
 *                             example: 0.1
 *                           CASH:
 *                             type: number
 *                             example: 0
 *                 randomSubject:
 *                   type: object
 *                   properties:
 *                     subjectId:
 *                       type: integer
 *                       example: 4
 *                     subjectType:
 *                       type: string
 *                       example: 적금
 *                     title:
 *                       type: string
 *                       example: 부자씨 적금
 *                     description:
 *                       type: string
 *                       example: 하나원큐 로그인 횟수 & 하나 합 서비스 등록에 따라 우대금리 받고, 적금 모아서 예금으로~ 예금이 모여서 목돈을 제공하는 상품
 *                     features:
 *                       type: string
 *                       example: 적금을 모아서 예금으로~
 *                     period:
 *                       type: string
 *                       example: 1년
 *                     amount:
 *                       type: string
 *                       example: 50만원 이하
 *                     interestRate:
 *                       type: string
 *                       example: 최대 연 2.00%(세전)
 *                     subjectUrl:
 *                       type: string
 *                       format: uri
 *                       example: https://www.kebhana.com/cont/mall/mall08/mall0801/mall080102/1486817_115157.jsp
 */

import { getAuthUser } from "@/lib/auth";
import { replicaPrisma } from "@/lib/prisma/replicaClient";
import { NextRequest, NextResponse } from "next/server";
import {
  getTodayRecoUserIds,
  getRandomSubject,
  calculateRatios,
} from "@/services/server/matchCardListService";

export async function GET(_req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { message: "인증되지 않은 사용자입니다." },
        { status: 401 },
      );
    }

    const userIds = await getTodayRecoUserIds(user.userId);
    const [randomSubject, users] = await Promise.all([
      getRandomSubject(),
      replicaPrisma.user.findMany({
        where: { userId: { in: userIds }, isDeleted: false },
        include: {
          consumeHistory: true,
          userFinancialProduct: {
            include: {
              financialProduct: {
                select: { category: true },
              },
            },
          },
          loan: true,
          userBadge: true,
        },
      }),
    ]);

    const data = users.map((user) => {
      const { financialProductRatio, categoryRatios } = calculateRatios({
        carValue: user.carValue !== null ? Number(user.carValue) : null,
        houseValue: user.houseValue !== null ? Number(user.houseValue) : null,
        userFinancialProduct: user.userFinancialProduct,
        loan: user.loan,
      });

      return {
        userId: user.userId,
        nickname: user.nickname,
        gender: user.gender,
        birthYear: user.birthYear,
        city: user.city,
        job: user.job,
        description: user.description,
        profileImage: user.profileImage,
        hasCar: user.hasCar,
        hasHouse: user.hasHouse,
        goalAmount: Number(user.goalAmount ?? 0),
        goalPeriod: user.goalPeriod,
        goalType: user.goalType,
        currentType: user.currentType,
        preferredType: user.preferredType,
        financialProductRatio,
        categoryRatios,
        badges: user.userBadge
          ? {
              diligent: user.userBadge.diligent,
              planner: user.userBadge.planner,
              saver: user.userBadge.saver,
              investor: user.userBadge.investor,
            }
          : null,
      };
    });

    return NextResponse.json({
      message: `매칭 카드 리스트(${data.length})와 광고를 반환했습니다.`,
      data,
      randomSubject,
    });
  } catch (err) {
    console.error("매칭 카드 리스트 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
