"use client";
import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cardListOptions } from "@/hooks/useCardList";
import { CardUser } from "@/app/types/cardList";
import HanaAdCard from "@/components/advertisement/HanaAdCard";
import ProfileCard from "@/components/profile/ProfileCard";
import { customUser } from "@/lib/customUserData";
import Button from "@/components/common/button/Button";
import { quizLogQueryOptions } from "@/hooks/useQuiz";

export default function HomePage() {
  const { data } = useSuspenseQuery(cardListOptions());
  const { data: quizLog } = useQuery(quizLogQueryOptions());
  const router = useRouter();

  const allUsers = data.data.map((user: CardUser) => customUser(user));
  const adData = data.randomSubject;

  // 좋아요/카드삭제 구현, 카드 상세페이지
  const initialUsers = allUsers.slice(0, 10);
  const additionalUsers = allUsers.slice(10, 15);
  const usersToRender = quizLog?.isPassed
    ? [...additionalUsers, ...initialUsers]
    : initialUsers;

  const handleQuizButtonClick = () => {
    // setIsQuizResolved(true);
    router.push("/quiz");
  };

  return (
    <div className="frame-container space-y-8">
      <div className="flex flex-col gap-5">
        {usersToRender.map((user, index) => (
          <div key={user.id}>
            <ProfileCard
              id={user.id}
              name={user.name}
              age={user.age}
              job={user.job}
              location={user.location}
              description={user.description}
              imageUrl={user.imageUrl}
              target={user.target}
              hasCar={user.hasCar}
              hasHouse={user.hasHouse}
              portfolioRatios={user.portfolioRatios}
              debtPercent={user.debtPercent}
              investorType={user.investorType}
              portfolioType={user.portfolioType}
            />
            {(index + 1) % 9 === 0 && adData && (
              <HanaAdCard
                key={`ad-${adData.subjectId}`}
                name={adData.title}
                interestRate={adData.interestRate.split("%")[0]}
                period={adData.period}
                subjectUrl={adData.subjectUrl}
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center">
        <Button
          disabled={quizLog?.isPassed ?? false}
          size="full"
          label="퀴즈 풀고 5명 더 보기"
          onClick={handleQuizButtonClick}
          className="bg-hanagreen-normal text-white rounded-xl py-3 font-semibold"
        />
      </div>
    </div>
  );
}
