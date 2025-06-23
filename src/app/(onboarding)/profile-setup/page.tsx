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
import Select from "@/components/common/Select";
import { SelectChangeEvent } from "@mui/material";
import { useSubmitProfile } from "@/hooks/useSubmitProfile";
import {
  GOAL_TAGS,
  GOAL_PERIOD_OPTIONS,
  goalUtils,
  type GoalTag,
  type GoalPeriodOption,
} from "@/lib/constants/profile";
import { useUserStore } from "@/lib/store/userStore";

export default function ProfileSetUpPage() {
  const [img, setImg] = useState<File | null>(null);
  const [introduction, setIntroduction] = useState("");
  const [job, setJob] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<GoalTag | null>(null);
  const [goalAmount, setGoalAmount] = useState("");
  const [goalPeriod, setGoalPeriod] = useState<GoalPeriodOption | null>(null);
  const [hasCar, setHasCar] = useState(false);
  const [carValue, setCarValue] = useState("");
  const [hasHouse, setHasHouse] = useState(false);
  const [houseValue, setHouseValue] = useState("");

  const { mutate: submitProfile } = useSubmitProfile();
  const nickname = useUserStore((state) => state.nickname);

  const isFormComplete =
    introduction.trim() !== "" &&
    job.trim() !== "" &&
    selectedGoal !== null &&
    goalAmount.trim() !== "" &&
    goalPeriod !== null;

  const handleGoalPeriodChange = (event: SelectChangeEvent) => {
    const selectedPeriod = event.target.value as GoalPeriodOption;
    setGoalPeriod(selectedPeriod);
  };

  const handleSubmit = () => {
    if (!isFormComplete || !selectedGoal || !goalPeriod) return;

    const goalType = goalUtils.getEnumFromSelectedTag(selectedGoal);
    const goalPeriodValue = goalUtils.getValueFromSelectedPeriod(goalPeriod);

    if (!goalType || !goalPeriodValue) return;

    const convertedCarValue =
      hasCar && carValue ? (parseInt(carValue) * 10000000).toString() : "";

    const convertedHouseValue =
      hasHouse && houseValue
        ? (parseInt(houseValue) * 100000000).toString()
        : "";

    submitProfile({
      img,
      description: introduction,
      job,
      goalType,
      goalAmount,
      goalPeriod: goalPeriodValue,
      hasCar,
      carValue: convertedCarValue,
      hasHouse,
      houseValue: convertedHouseValue,
    });
  };

  return (
    <div className="frame-container w-full min-h-screen bg-hanagreen-normal">
      <Header title="프로필" color="white" className="bg-hanagreen-normal" />
      <div className="relative mt-24 px-5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
            <ImageUploader onChange={(file) => setImg(file)} />
          </div>
        </div>

        <div className="bg-background w-full min-h-[calc(100vh-64px)] pt-24 pb-10 px-4 shadow-md rounded-t-3xl">
          <div className="flex flex-col space-y-[1.875rem]">
            <div className="text-3xl font-semibold text-text-primary">
              {nickname || "회원"}님, 안녕하세요
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
                  <Select
                    id="goalPeriod"
                    value={goalPeriod || ""}
                    onChange={handleGoalPeriodChange}
                    options={GOAL_PERIOD_OPTIONS as unknown as string[]}
                    className="w-full"
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
                <AssetToggleRow
                  unit="천만원"
                  isOwned={hasCar}
                  value={carValue}
                  onToggle={(checked: boolean) => setHasCar(checked)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCarValue(e.target.value)
                  }
                />
              </div>

              <div>
                <p className="text-sm text-text-primary mb-2">• 부동산</p>
                <AssetToggleRow
                  unit="억원"
                  isOwned={hasHouse}
                  value={houseValue}
                  onToggle={(checked: boolean) => setHasHouse(checked)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHouseValue(e.target.value)
                  }
                />
              </div>
            </div>

            <Button
              intent={isFormComplete ? "red" : "default"}
              size="full"
              label="완료"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
