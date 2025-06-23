"use client";

import { useMutation } from "@tanstack/react-query";
import { submitProfile, ProfilePayload } from "@/services/myProfile";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useSubmitProfile() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ProfilePayload) => submitProfile(payload),
    onSuccess: () => {
      router.push("/pairing-book");
    },
    onError: () => {
      toast.error("프로필 등록 중 오류가 발생했습니다.");
    },
  });
}
