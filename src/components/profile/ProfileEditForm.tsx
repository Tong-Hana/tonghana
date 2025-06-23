"use client";

import { useState } from "react";
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
import { GOAL_TAGS, type GoalTag } from "@/lib/constants/profile";

const INCOME_OPTIONS = [
  "400만 원대",
  "600만 원대",
  "800만 원대",
  "1000만 원대 이상",
];

export default function ProfileEditForm() {
  const [name, setName] = useState<string>("박승희");
  const [introduction, setIntroduction] =
    useState("성수에 살고 분당에서 일해요");
  const [birthDate, setBirthDate] = useState<Date | null>(
    new Date("1990-01-01"),
  );
  const [gender, setGender] = useState<Gender | null>(null);
  const [city, setCity] = useState("서울시");
  const [district, setDistrict] = useState("성동구");
  const [job, setJob] = useState("프리랜서");
  const [goalAmount, setGoalAmount] = useState("1억");
  const [goalPeriod, setGoalPeriod] = useState("3년");
  const [selectedGoal, setSelectedGoal] = useState<GoalTag | null>(
    "내 집 마련",
  );
  const [, setProfileImage] = useState<File | null>(null);
  const [carPrice, setCarPrice] = useState("5000");
  const [datePrice, setDatePrice] = useState("30");
  const [shoePrice, setShoePrice] = useState("20");
  const [preferredCity, setPreferredCity] = useState("서울시");
  const [preferredDistrict, setPreferredDistrict] = useState("구로구");
  const [selectedIncome, setSelectedIncome] = useState<string | null>(
    "1000만 원대 이상",
  );

  return (
    <form className="flex flex-col gap-5 px-4 py-6">
      <div className="flex justify-center">
        <ImageUploader imageUrl={undefined} onChange={setProfileImage} />
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
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-normal text-text-primary">
              목표 기간 <span className="text-hanared-normal">*</span>
            </p>
            <Input
              required
              placeholder="목표 기간을 입력해주세요"
              className="w-full"
              value={goalPeriod}
              onChange={(e) => setGoalPeriod(e.target.value)}
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
          <AssetToggleRow unit="천만원" />
        </div>

        <div>
          <p className="text-sm text-text-primary mb-2">• 부동산</p>
          <AssetToggleRow unit="억원" />
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
    </form>
  );
}
