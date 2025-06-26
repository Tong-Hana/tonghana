import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { quizDetailQueryOptions } from "@/hooks/useQuiz";
import { getQueryClient } from "@/lib/getQueryClient";
import { Suspense } from "react";

export default async function QuizDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(quizDetailQueryOptions());
  return (
    <div className="px-5">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>로딩 중 ...</div>}>{children}</Suspense>
      </HydrationBoundary>
    </div>
  );
}
