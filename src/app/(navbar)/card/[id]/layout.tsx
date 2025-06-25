import Header from "@/components/common/Header";
import { userProfileOptions } from "@/hooks/useUserProfileQuery";
import { getQueryClient } from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { customUser } from "@/lib/customUserData";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function CardDetailLayout({
  children,
  params,
}: LayoutProps) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.id);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(userProfileOptions(String(userId)));

  const userData = queryClient.getQueryData(
    userProfileOptions(String(userId)).queryKey,
  );
  const user = userData?.data ? customUser(userData.data) : null;

  let headerTitle = "카드 상세";
  headerTitle = user ? `${user.name}` : "카드 상세";

  return (
    <div>
      <Header title={headerTitle} centerTitle={true} showBackButton={true} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading profile...</div>}>
          <div className="pb-[1rem]" />
          {children}
          <div className="pb-[5rem]" />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
