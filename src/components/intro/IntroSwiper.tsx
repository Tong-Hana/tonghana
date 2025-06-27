"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { useRouter } from "next/navigation";

import IntroSlide from "@/components/intro/IntroSlide";
import DotIndicator from "@/components/intro/DotIndicator";
import Button from "@/components/common/button/Button";

const slides = [
  {
    imageSrc: "/onboarding1.png",
    title: "경제 가치관 기반 매칭",
    description:
      "“FTTI 분석과 현재 자산 보유 현황 기반으로”\n당신의 재무 성향에 가장 잘 맞는 상대를 찾아드려요.",
  },
  {
    imageSrc: "/onboarding2.png",
    title: "금융 포트폴리오 분석",
    description:
      "“마이데이터로 내 자산현황을 파악해요.”\n 자산현황을 통하나의 그래프로 한 눈에 볼 수 있어요.",
  },
  {
    imageSrc: "/onboarding3.png",
    title: "금융 지식 퀴즈",
    description:
      "“매일 다른 퀴즈로 금융 감각을 키워요.”\n 반복할수록 더 똑똑해지는 금융 퀴즈를 경험해보세요.",
  },
];

export default function IntroSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex-1">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          spaceBetween={24}
          slidesPerView={1}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <IntroSlide {...slide} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <DotIndicator
        total={slides.length}
        current={currentIndex}
        onDotClick={(index) => swiperRef.current?.slideTo(index)}
      />

      <div className="w-[90%] mx-auto mt-6 mb-10">
        <Button
          label="시작하기"
          intent="green"
          size="full"
          onClick={() => router.push("/login")}
        />
      </div>
    </div>
  );
}
