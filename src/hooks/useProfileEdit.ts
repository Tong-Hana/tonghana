import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  updateProfile,
  ProfileEditRequest,
  ProfileEditResponse,
} from "@/services/profileEdit";

export const useProfileEdit = (
  options?: UseMutationOptions<
    ProfileEditResponse,
    Error,
    ProfileEditRequest,
    unknown
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data, variables, context) => {
      // 프로필 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });

      // 기존 onSuccess 콜백이 있다면 실행
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
