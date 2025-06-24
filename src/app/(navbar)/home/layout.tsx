import Header from "@/components/common/Header";
import { cardListOptions } from "@/hooks/useCardList";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(cardListOptions());

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Header title="통하나" centerTitle={false} showBackButton={false} />
        <div className="pb-[1rem]" />
        {children}
        <div className="pb-[4rem]" />
      </HydrationBoundary>
    </div>
  );
}
