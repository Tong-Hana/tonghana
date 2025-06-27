"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/profile/imageUploader/ImageUploader";
import InputWithLabel from "@/components/common/input/InputWithLabel";
import AddressSelectGroup from "@/components/common/AddressSelectGroup";
import GenderButtonGroup, {
  Gender,
} from "@/components/common/GenderButtonGroup";
import DatePicker from "@/components/common/DatePicker";
import Input from "@/components/common/input/Input";
import Tag from "@/components/common/tag/Tag";
import AssetToggleRow from "@/components/profile/AssetToggleRow";
import QuestionCard from "@/components/question/QuestionCard";
import Button from "@/components/common/button/Button";
import Select from "@/components/common/Select";
import {
  GOAL_TAGS,
  GOAL_PERIOD_OPTIONS,
  type GoalTag,
  type GoalPeriodOption,
  goalUtils,
} from "@/lib/constants/profile";
import { SelectChangeEvent } from "@mui/material/Select";
import { useMyFullProfile } from "@/hooks/useMyFullProfile";
import { useProfileEdit } from "@/hooks/useProfileEdit";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GoalType, GoalPeriod } from "@/lib/constants/enums";
import { pairingIncomeUtils, PairingIncomeOption } from "@/app/types/profiles";
import { useQueryClient } from "@tanstack/react-query";

const INCOME_OPTIONS = [
  "400만 원대",
  "600만 원대",
  "800만 원대",
  "1000만 원대 이상",
];

export default function ProfileEditForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profileData, isLoading } = useMyFullProfile();

  const [name, setName] = useState<string>("");
  const [introduction, setIntroduction] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [job, setJob] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalPeriod, setGoalPeriod] = useState<GoalPeriodOption | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalTag | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [hasCar, setHasCar] = useState(false);
  const [carPrice, setCarPrice] = useState("");
  const [hasHouse, setHasHouse] = useState(false);
  const [housePrice, setHousePrice] = useState("");
  const [datePrice, setDatePrice] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [preferredDistrict, setPreferredDistrict] = useState("");
  const [selectedIncome, setSelectedIncome] = useState<string | null>(null);

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setName(profile.nickname || "");
      setIntroduction(profile.description || "");
      setBirthDate(
        profile.birthYear ? new Date(profile.birthYear, 0, 1) : null,
      );
      setGender((profile.gender as Gender) || null);
      setCity(profile.city?.split(" ")[0] || "");
      setDistrict(profile.city?.split(" ")[1] || "");
      setJob(profile.job || "");
      setGoalAmount(
        profile.goalAmount ? (profile.goalAmount / 100000000).toString() : "",
      );

      const periodOption = goalUtils.periodValueToOption(
        profile.goalPeriod as GoalPeriod,
      );
      setGoalPeriod(periodOption || null);

      const goalTag = goalUtils.enumToTag(profile.goalType as GoalType);
      setSelectedGoal(goalTag || null);
      setHasCar(profile.hasCar || false);
      setCarPrice(
        profile.carValue ? (profile.carValue / 10000000).toString() : "",
      );
      setHasHouse(profile.hasHouse || false);
      setHousePrice(
        profile.houseValue ? (profile.houseValue / 100000000).toString() : "",
      );

      if (profile.pairingAnswer) {
        setDatePrice(
          profile.pairingAnswer.dateBudget
            ? (profile.pairingAnswer.dateBudget / 10000).toString()
            : "",
        );
        setShoePrice(
          profile.pairingAnswer.shoesBudget
            ? (profile.pairingAnswer.shoesBudget / 10000).toString()
            : "",
        );
        setCarPrice(
          profile.pairingAnswer.carBudget
            ? (Number(profile.pairingAnswer.carBudget) / 10000000).toString()
            : "",
        );
        setPreferredCity(
          profile.pairingAnswer.preferredCity?.split(" ")[0] || "",
        );
        setPreferredDistrict(
          profile.pairingAnswer.preferredCity?.split(" ")[1] || "",
        );
        setSelectedIncome(
          pairingIncomeUtils.enumToOption(
            profile.pairingAnswer.idealIncomeRange,
          ) || null,
        );
      }
    }
  }, [profileData]);

  const handleGoalPeriodChange = (event: SelectChangeEvent) => {
    const selectedPeriod = event.target.value as GoalPeriodOption;
    setGoalPeriod(selectedPeriod);
  };

  const profileEditMutation = useProfileEdit({
    onSuccess: async () => {
      toast.success("프로필이 성공적으로 수정되었습니다!");
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.refetchQueries({ queryKey: ["userProfile"] });

      // 페이지 새로고침으로 캐시 문제 해결
      router.refresh();

      setTimeout(() => {
        router.push("/profile");
      }, 100);
    },
    onError: () => {
      toast.error("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !introduction.trim() || !job.trim()) {
      toast.error("필수 정보를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const goalType = selectedGoal
        ? goalUtils.getEnumFromSelectedTag(selectedGoal)
        : undefined;
      const goalPeriodValue = goalPeriod
        ? goalUtils.getValueFromSelectedPeriod(goalPeriod)
        : undefined;

      if (profileImage) {
        const formData = new FormData();

        formData.append("img", profileImage);
        formData.append("nickname", name);
        formData.append("description", introduction);
        formData.append("job", job);
        formData.append("city", district ? `${city} ${district}` : city);

        if (goalType) formData.append("goalType", goalType);
        if (goalAmount)
          formData.append(
            "goalAmount",
            (parseInt(goalAmount) * 100000000).toString(),
          );
        if (goalPeriodValue) formData.append("goalPeriod", goalPeriodValue);

        formData.append("hasCar", hasCar.toString());
        if (hasCar && carPrice)
          formData.append(
            "carValue",
            (parseInt(carPrice) * 10000000).toString(),
          );

        formData.append("hasHouse", hasHouse.toString());
        if (hasHouse && housePrice)
          formData.append(
            "houseValue",
            (parseInt(housePrice) * 100000000).toString(),
          );

        // 페어링 답변을 JSON 문자열로 변환
        const pairingAnswerData: Record<string, string | number> = {};
        if (carPrice)
          pairingAnswerData.carBudget = parseInt(carPrice) * 10000000;
        if (datePrice)
          pairingAnswerData.dateBudget = parseInt(datePrice) * 10000;
        if (shoePrice)
          pairingAnswerData.shoesBudget = parseInt(shoePrice) * 10000;
        if (preferredCity) {
          const fullPreferredCity = preferredDistrict
            ? `${preferredCity} ${preferredDistrict}`
            : preferredCity;
          pairingAnswerData.preferredCity = fullPreferredCity;
        }
        if (selectedIncome) {
          const incomeRange = pairingIncomeUtils.optionToEnum(
            selectedIncome as PairingIncomeOption,
          );
          if (incomeRange) pairingAnswerData.idealIncomeRange = incomeRange;
        }

        // 페어링 답변이 있는 경우에만 추가
        if (Object.keys(pairingAnswerData).length > 0) {
          formData.append("pairingAnswer", JSON.stringify(pairingAnswerData));
        }

        const response = await fetch("/api/profiles/me", {
          method: "PATCH",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("프로필 수정 실패");
        }
      } else {
        profileEditMutation.mutate({
          nickname: name,
          description: introduction,
          job,
          city: district ? `${city} ${district}` : city,
          goalType: goalType || undefined,
          goalAmount: goalAmount ? parseInt(goalAmount) * 100000000 : undefined,
          goalPeriod: goalPeriodValue || undefined,
          hasCar,
          carValue:
            hasCar && carPrice ? parseInt(carPrice) * 10000000 : undefined,
          hasHouse,
          houseValue:
            hasHouse && housePrice
              ? parseInt(housePrice) * 100000000
              : undefined,
          pairingAnswer: {
            carBudget: carPrice ? parseInt(carPrice) * 10000000 : undefined,
            dateBudget: datePrice ? parseInt(datePrice) * 10000 : undefined,
            shoesBudget: shoePrice ? parseInt(shoePrice) * 10000 : undefined,
            preferredCity: preferredDistrict
              ? `${preferredCity} ${preferredDistrict}`
              : preferredCity,
            idealIncomeRange: selectedIncome
              ? pairingIncomeUtils.optionToEnum(
                  selectedIncome as PairingIncomeOption,
                )
              : undefined,
          },
        });
        return;
      }

      toast.success("프로필이 성공적으로 수정되었습니다!");
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.refetchQueries({ queryKey: ["userProfile"] });

      setTimeout(() => {
        router.push("/profile");
      }, 100);
    } catch {
      toast.error("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>프로필 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div className="flex justify-center">
        <div className="relative">
          <ImageUploader
            imageUrl={profileData?.data?.profileImage || undefined}
            onChange={(file) => {
              setProfileImage(file);
            }}
          />
        </div>
      </div>

      <InputWithLabel
        label="닉네임"
        placeholder="닉네임을 입력해주세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <InputWithLabel
        label="한 줄 소개"
        placeholder="성수에 살고 분당에서 일해요"
        value={introduction}
        onChange={(e) => setIntroduction(e.target.value)}
        required
      />

      <DatePicker date={birthDate} onChange={setBirthDate} />

      <GenderButtonGroup selectedGender={gender} onSelect={setGender} />

      <AddressSelectGroup
        city={city}
        district={district}
        onChangeCity={(e) => {
          setCity(e.target.value);
          setDistrict("");
        }}
        onChangeDistrict={(e) => setDistrict(e.target.value)}
      />

      <InputWithLabel
        label="직업"
        placeholder="프리랜서"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        required
      />

      {/* 목표 설정 */}
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
              unit="억원"
              unitPosition="end"
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

      {/* 자산 보유 현황 */}
      <div className="space-y-3">
        <p className="text-sm font-normal text-text-primary">
          실물 자산 보유 현황
        </p>

        <div>
          <p className="text-sm text-text-primary mb-2">• 자차</p>
          <AssetToggleRow
            unit="천만원"
            isOwned={hasCar}
            value={carPrice}
            onToggle={setHasCar}
            onChange={(e) => setCarPrice(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm text-text-primary mb-2">• 부동산</p>
          <AssetToggleRow
            unit="억원"
            isOwned={hasHouse}
            value={housePrice}
            onToggle={setHasHouse}
            onChange={(e) => setHousePrice(e.target.value)}
          />
        </div>
      </div>

      {/* 페어링북 응답 항목 입력 */}
      <QuestionCard
        index={1}
        question="차 한 대, 기념일 한 끼, 신발 한켤레에 쓸 수 있는 최대 금액은?"
      >
        <div className="space-y-2">
          {[
            {
              label: "차",
              value: carPrice,
              setter: setCarPrice,
              unit: "천만원",
            },
            {
              label: "기념일",
              value: datePrice,
              setter: setDatePrice,
              unit: "만원",
            },
            {
              label: "신발",
              value: shoePrice,
              setter: setShoePrice,
              unit: "만원",
            },
          ].map(({ label, value, setter, unit }) => (
            <div key={label} className="flex items-center gap-2">
              <Tag text={label} />
              <div className="flex-1">
                <Input
                  placeholder={`${unit} 입력`}
                  unit={unit}
                  unitPosition="end"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </QuestionCard>

      <QuestionCard index={2} question="살고 싶은 신혼집 위치는?">
        <AddressSelectGroup
          city={preferredCity}
          district={preferredDistrict}
          onChangeCity={(e) => {
            setPreferredCity(e.target.value);
            setPreferredDistrict("");
          }}
          onChangeDistrict={(e) => setPreferredDistrict(e.target.value)}
        />
      </QuestionCard>

      <QuestionCard index={3} question="내가 생각하는 이상적인 부부 월수입은?">
        <div className="flex flex-wrap gap-2">
          {INCOME_OPTIONS.map((option) => (
            <Tag
              key={option}
              text={option}
              selectable
              selected={selectedIncome === option}
              onClick={() => setSelectedIncome(option)}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="pt-6">
        <Button
          intent={
            isSubmitting || profileEditMutation.isPending ? "default" : "green"
          }
          size="full"
          label={
            isSubmitting || profileEditMutation.isPending
              ? "저장 중..."
              : "저장"
          }
          onClick={handleSubmit}
          disabled={isSubmitting || profileEditMutation.isPending}
        />
      </div>
    </div>
  );
}
