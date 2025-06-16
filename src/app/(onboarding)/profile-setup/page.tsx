"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import ImageUploader from "@/components/profile/imageUploader/ImageUploader";
import InfoCard from "@/components/common/InfoCard";
import InputWithLabel from "@/components/common/input/InputWithLabel";
import Input from "@/components/common/input/Input";
import Tag from "@/components/common/tag/Tag";
import AssetToggleRow from "@/components/profile/AssetToggleRow";
import Button from "@/components/common/button/Button";

const GOAL_TAGS = ["내 집 마련", "목돈 마련", "노후 자금", "결혼 자금"];

export default function ProfileSetUpPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState("");
  const [job, setJob] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalPeriod, setGoalPeriod] = useState("");

  const isFormComplete =
    introduction.trim() !== "" &&
    job.trim() !== "" &&
    selectedGoal !== null &&
    goalAmount.trim() !== "" &&
    goalPeriod.trim() !== "";

  return (
    <div className="frame-container w-full min-h-screen bg-hanagreen-normal">
      <Header title="프로필" />

      <div className="relative mt-24 px-5">
        {/* 프로필 이미지 업로더 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
            <ImageUploader onChange={() => {}} />
          </div>
        </div>

        <div className="bg-background w-full min-h-[calc(100vh-64px)] pt-24 pb-10 px-4 shadow-md rounded-t-3xl">
          <div className="flex flex-col space-y-[1.875rem]">
            <div className="text-3xl font-semibold text-text-primary">
              승희님, 안녕하세요
            </div>

            <InfoCard
              content={
                <>
                  지금부터 <span className="text-hanagreen-normal">별돌이</span>
                  와 함께 매력적인 프로필을 만들어보세요!
                </>
              }
              imageType={"attentionStarBoy"}
            />

            <InputWithLabel
              label="한 줄 소개"
              required
              placeholder="성수에 살고 분당에서 일해요"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
            />

            <InputWithLabel
              label="직업"
              required
              placeholder="학생"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />

            <div className="space-y-2">
              <p className="text-sm font-normal text-text-primary">
                목표 설정 <span className="text-hanared-normal">*</span>
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {GOAL_TAGS.map((goal) => (
                  <Tag
                    key={goal}
                    text={goal}
                    selectable
                    selected={selectedGoal === goal}
                    onClick={() => setSelectedGoal(goal)}
                  />
                ))}
              </div>
            </div>

            {selectedGoal && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-normal text-text-primary">
                    목표 금액 <span className="text-hanared-normal">*</span>
                  </p>
                  <Input
                    required
                    placeholder="예: 1억"
                    className="w-full"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-normal text-text-primary">
                    목표 기간 <span className="text-hanared-normal">*</span>
                  </p>
                  <Input
                    required
                    placeholder="목표 기간을 선택해 주세요"
                    className="w-full"
                    value={goalPeriod}
                    onChange={(e) => setGoalPeriod(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-normal text-text-primary">
                실물 자산 보유 현황
              </p>

              <div>
                <p className="text-sm text-text-primary mb-2">• 자차</p>
                <AssetToggleRow unit="천만원" />
              </div>

              <div>
                <p className="text-sm text-text-primary mb-2">• 부동산</p>
                <AssetToggleRow unit="억원" />
              </div>
            </div>

            <Button
              intent={isFormComplete ? "red" : "default"}
              size="full"
              label="완료"
              onClick={() => {
                if (!isFormComplete) return;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
