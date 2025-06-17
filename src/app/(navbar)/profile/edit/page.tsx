import Header from "@/components/common/Header";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="내 정보 수정하기" />
      <div className="flex-1 overflow-y-auto pt-4 pb-6">
        <ProfileEditForm />
      </div>
    </div>
  );
}
