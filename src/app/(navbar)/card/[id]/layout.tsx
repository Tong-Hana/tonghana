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
    <div className="bg-hanagreen-normal -mx-5 px-5">
      <Header
        className="bg-hanagreen-normal"
        title={headerTitle}
        centerTitle={true}
        color="white"
        showBackButton={true}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <div className="flex flex-col min-h-screen h-full">
              <div className="mt-5 mb-5 h-full w-full p-3 rounded-xl bg-hanagreen-light border-hanagreen-light-active border shadow-[0px_1px_3px_0px_#0000001A]">
                <div className="bg-white w-full text-text-secondary aspect-square rounded-xl overflow-hidden flex items-center justify-center">
                  프로필 불러오는 중...
                </div>
              </div>
            </div>
          }
        >
          <div className="pb-[1rem]" />
          {children}
          <div className="pb-[5rem]" />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
