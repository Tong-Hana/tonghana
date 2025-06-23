"use client";

import { useMutation } from "@tanstack/react-query";
import { submitProfile, ProfilePayload } from "@/services/myProfile";
import toast from "react-hot-toast";

export function useSubmitProfile() {
  return useMutation({
    mutationFn: (payload: ProfilePayload) => submitProfile(payload),
    onSuccess: () => {
      toast.success("프로필 등록이 완료되었습니다!");
    },
    onError: () => {
      toast.error("프로필 등록 중 오류가 발생했습니다.");
    },
  });
}
