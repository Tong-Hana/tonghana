"use client";

export const dynamic = "force-dynamic";

import InfoCard from "@/components/common/InfoCard";
import QuizButton from "@/components/quiz/QuizButton";
import ClientProductLinkButton from "@/components/quiz/ClientProductLinkButton";
import HanaLogo from "../../../../public/hana_logo.svg";
import { useSuspenseQuery } from "@tanstack/react-query";
import { quizQueryOptions } from "@/hooks/useQuiz";

export default function QuizPage() {
  const { data } = useSuspenseQuery(quizQueryOptions());
  const quizData = data.subject;
  const productCardStyle = "flex flex-col gap-5 p-5 rounded-3xl";
  const cardTitleStyle = "text-lg font-semibold text-text-primary leading-7";
  const cardTextStyle = "text-base/light leading-6 text-text-primary";
  const cardSpanStyle = "text-lg text-hanagreen-normal font-medium";
  const spanType =
    quizData.subjectType === "대출" ? "대출 한도." : "가입 금액.";
  const needDetail = quizData.subjectType !== "금융상식";
  return (
    <div className="flex flex-col relative w-full pb-14 overflow-y-scroll gap-8 scrollbar-hide">
      <div className="font-light mt-4 text-xl leading-7 tracking-normal text-text-primary">
        퀴즈를 풀고 매칭 상대를 더 만나 보세요!
      </div>
      <div className="px-1">
        <InfoCard
          content={
            <>
              오늘은{" "}
              <span className="text-hanagreen-normal">하나은행 금융 상품</span>{" "}
              퀴즈에요!
              <br />
              아래 정보를 잘 읽고 풀어보세요
              <br />
              기회는 단 한번!
            </>
          }
          imageType={"infoStarBoy"}
        />
      </div>
      <div className={productCardStyle + " bg-hanared-light"}>
        <div className={`${cardTitleStyle} flex items-center gap-2`}>
          <HanaLogo className="w-5 h-5" />
          {quizData.title}
        </div>
        <div className={cardTextStyle + " whitespace-pre-wrap"}>
          {quizData.description}
        </div>
        <ClientProductLinkButton subjectUrl={quizData.subjectUrl} />
      </div>
      {needDetail ? (
        <div className={productCardStyle + " bg-hanagreen-light"}>
          <div className={cardTitleStyle}>상세정보</div>
          <div className={cardTextStyle}>
            <span className={cardSpanStyle}>특징.</span> {quizData.features}
            <br />
            <span className={cardSpanStyle}>기간.</span> {quizData.period}
            <br />
            <span className={cardSpanStyle}>{spanType} </span> {quizData.amount}
            <br />
            <span className={cardSpanStyle}>금리. </span>{" "}
            {quizData.interestRate}
            <br />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div
        className="fixed bottom-12 left-0 right-0 w-full px-5 py-3"
        style={{ zIndex: 60 }}
      >
        <QuizButton />
      </div>
    </div>
  );
}
