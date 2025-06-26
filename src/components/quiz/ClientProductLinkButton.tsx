"use client";

import Button from "@/components/common/button/Button";

type Props = {
  subjectUrl: string;
};

export default function ClientQuizLinkButton({ subjectUrl }: Props) {
  const handleClick = () => {
    if (!subjectUrl) return;
    window.open(subjectUrl, "_blank");
  };

  return (
    <Button label="자세히보기" intent="red" size="full" onClick={handleClick} />
  );
}
