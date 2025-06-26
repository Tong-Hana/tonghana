"use client";

import FttiSurvey from "@/components/ftti/FttiSurvey";

export default function FttiRetakePage() {
  const retakeInfoMessage = (
    <>
      투자 성향이 바뀌었나요? <br />
      8개의 FTTI(Financial Type Test Indicator) 질문으로 <br />
      나의 <span className="text-hanagreen-normal">투자 성향</span>을 다시
      알아보세요!
    </>
  );

  return (
    <FttiSurvey
      title="FTTI 재설문"
      infoMessage={retakeInfoMessage}
      isRetake={true}
    />
  );
}
