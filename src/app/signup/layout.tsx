import Header from "@/components/common/Header";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header title="회원가입" centerTitle={true} showBackButton={true} />
      <div className="px-5">{children}</div>
    </div>
  );
}
