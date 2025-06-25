import Header from "@/components/common/Header";
import { cardListOptions } from "@/hooks/useCardList";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(cardListOptions());

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header title="통하나" centerTitle={false} showBackButton={false} />
        <Suspense fallback={<div>Loading profile...</div>}>
          <div className="pb-[1rem]" />
          {children}
          <div className="pb-[4rem]" />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
