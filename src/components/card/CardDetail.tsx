"use client";

import ProfileCardDetail from "@/components/profile/ProfileCardDetail";
import { userProfileOptions } from "@/hooks/useUserProfileQuery";
import { customConsumeHistory } from "@/lib/customConsumeHistory";
import { customPairingAnswers } from "@/lib/customParingAnswer";
import { customUser } from "@/lib/customUserData";
import { useSuspenseQuery } from "@tanstack/react-query";
export default function CardDetailComponent({ userId }: { userId: string }) {
  const { data } = useSuspenseQuery(userProfileOptions(userId));

  const user = customUser(data?.data);
  const consumeHistoryData = customConsumeHistory(data?.data);
  const answer = customPairingAnswers(data?.data?.pairingAnswer);

  return (
    <div>
      <ProfileCardDetail
        user={user}
        answers={answer}
        data={consumeHistoryData}
        modalView={true}
      />
    </div>
  );
}
