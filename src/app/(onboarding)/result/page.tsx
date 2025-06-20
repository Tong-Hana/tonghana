"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/button/Button";
import FTTITypeCard from "@/components/ftti/FTTITypeCard";
import Image from "next/image";

const FTTI_TYPES = [
  {
    title: "안정형",
    description: "보수적, 원금 보전 추구",
    imageSrc: "/conservative.png",
  },
  {
    title: "안전추구형",
    description: `안정 수익 추구, 일부 위험 수용`,
    imageSrc: "/moderate.png",
  },
  {
    title: "위험중립형",
    description: "예적금 초과 수익, 손실 감내 가능",
    imageSrc: "/neutral.png",
  },
  {
    title: "적극투자형",
    description: "주식·파생 등 고위험 투자 의향",
    imageSrc: "/aggressive.png",
  },
  {
    title: "공격투자형",
    description: "초고수익 추구, 고위험 적극 수용",
    imageSrc: "/very_aggressive.png",
  },
];

export default function FTTIResultPage() {
  const [selectedType, setSelectedType] = useState<string>("적극투자형");

  return (
    <div>
      <Header title="FTTI 설문 결과" />
      <div className="min-h-screen bg-background px-4 py-6 space-y-10">
        <section className="bg-white rounded-3xl p-6 flex flex-col items-center text-center space-y-3">
          <Image
            src="/conservative.png"
            alt="내 투자 성향"
            width={100}
            height={100}
          />
          <p className="mt-8 text-text-primary text-xl font-semibold">
            당신의 투자 성향은
            <span className="text-hanagreen-normal"> 안정형</span>이에요!
          </p>
        </section>

        <div>
          <p className="text-2xl font-semibold text-text-primary">
            상대 FTTI 유형 선택
          </p>
          <p className="text-xl font-normal text-text-primary">
            통하고 싶은 FTTI 유형을 선택해 주세요
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {FTTI_TYPES.map((card) => (
            <FTTITypeCard
              key={card.title}
              {...card}
              selected={selectedType === card.title}
              onClick={() => setSelectedType(card.title)}
            />
          ))}
        </div>

        <div className="pt-6">
          <Button label="완료" size="full" intent="green" />
        </div>
      </div>
    </div>
  );
}
