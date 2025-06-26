"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/button/Button";
import FTTITypeCard from "@/components/ftti/FTTITypeCard";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { usePartnerFttiMutation } from "@/hooks/usePartnerFttiMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FTTI_TYPES = [
  {
    key: "CONSERVATIVE",
    title: "안정형",
    description: "보수적, 원금 보전 추구",
    imageSrc: "/conservative.png",
    apiValue: 1,
  },
  {
    key: "MODERATE",
    title: "안전추구형",
    description: `안정 수익 추구, 일부 위험 수용`,
    imageSrc: "/moderate.png",
    apiValue: 2,
  },
  {
    key: "NEUTRAL",
    title: "위험중립형",
    description: "예적금 초과 수익, 손실 감내 가능",
    imageSrc: "/neutral.png",
    apiValue: 3,
  },
  {
    key: "AGGRESSIVE",
    title: "적극투자형",
    description: "주식·파생 등 고위험 투자 의향",
    imageSrc: "/aggressive.png",
    apiValue: 4,
  },
  {
    key: "VERY_AGGRESSIVE",
    title: "공격투자형",
    description: "초고수익 추구, 고위험 적극 수용",
    imageSrc: "/very_aggressive.png",
    apiValue: 5,
  },
];

export default function FTTIResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const type = searchParams.get("type") || "AGGRESSIVE";
  const isRetake = searchParams.get("retake") === "true";
  const selected = FTTI_TYPES.find((t) => t.key === type) || FTTI_TYPES[3];
  const [selectedPartnerType, setSelectedPartnerType] = useState<string | null>(
    null,
  );

  const partnerFttiMutation = usePartnerFttiMutation({
    onSuccess: async () => {
      if (isRetake) {
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        await queryClient.refetchQueries({ queryKey: ["userProfile"] });

        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        router.push("/home");
      }
    },
    onError: () => {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleSubmit = () => {
    if (!selectedPartnerType) {
      toast.error("상대 FTTI 유형을 선택해주세요.");
      return;
    }

    const selectedFttiType = FTTI_TYPES.find(
      (t) => t.title === selectedPartnerType,
    );
    if (!selectedFttiType) return;

    partnerFttiMutation.mutate({ type: selectedFttiType.apiValue });
  };

  return (
    <div>
      <Header title={isRetake ? "FTTI 재설문 결과" : "FTTI 설문 결과"} />
      <div className="min-h-screen bg-background px-4 py-6 space-y-10">
        <section className="bg-white rounded-3xl p-6 flex flex-col items-center text-center space-y-3">
          <Image
            src={selected.imageSrc}
            alt="내 투자 성향"
            width={100}
            height={100}
          />
          <p className="mt-8 text-text-primary text-xl font-semibold">
            {isRetake ? "변경된 " : "당신의 "}투자 성향은
            <span className="text-hanagreen-normal"> {selected.title}</span>
            이에요!
          </p>
        </section>

        <div>
          <p className="text-2xl font-semibold text-text-primary">
            상대 FTTI 유형 선택
          </p>
          <p className="text-xl font-normal text-text-primary">
            {isRetake
              ? "변경된 성향에 맞는 FTTI 유형을 선택해 주세요"
              : "통하고 싶은 FTTI 유형을 선택해 주세요"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {FTTI_TYPES.map((card) => (
            <FTTITypeCard
              key={card.key}
              title={card.title}
              description={card.description}
              imageSrc={card.imageSrc}
              selected={selectedPartnerType === card.title}
              onClick={() => setSelectedPartnerType(card.title)}
            />
          ))}
        </div>

        <div className="pt-6">
          <Button
            label={partnerFttiMutation.isPending ? "저장 중..." : "완료"}
            size="full"
            intent={selectedPartnerType ? "green" : "default"}
            onClick={handleSubmit}
            disabled={!selectedPartnerType || partnerFttiMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
