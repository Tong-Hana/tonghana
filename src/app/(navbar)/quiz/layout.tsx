import Header from "@/components/common/Header";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { quizQueryOptions } from "@/hooks/useQuiz";
import { Suspense } from "react";

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(quizQueryOptions());
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <Header
            title="오늘의 퀴즈"
            centerTitle={false}
            showBackButton={false}
          />
          {children}
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
