"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/common/Header";
import QuestionCard from "@/components/question/QuestionCard";
import Tag from "@/components/common/tag/Tag";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import InfoCard from "@/components/common/InfoCard";
import AddressSelectGroup from "@/components/common/AddressSelectGroup";
import { useUserStore } from "@/lib/store/userStore";

import {
  savePairingAnswers,
  PairingAnswersData,
} from "@/services/pairingAnswers";
import {
  PairingIncomeOptions,
  pairingIncomeUtils,
  PairingIncomeOption,
} from "@/app/types/profiles";

export default function PairingBookPage() {
  const router = useRouter();
  const [carPrice, setCarPrice] = useState("");
  const [datePrice, setDatePrice] = useState("");
  const [shoePrice, setShoePrice] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [selectedIncome, setSelectedIncome] =
    useState<PairingIncomeOption | null>(null);
  const nickname = useUserStore((state) => state.nickname);

  const isValid = [
    carPrice.trim(),
    datePrice.trim(),
    shoePrice.trim(),
    selectedCity.trim(),
    selectedDistrict.trim(),
    selectedIncome,
  ].every(Boolean);

  const mutation = useMutation({
    mutationFn: (data: PairingAnswersData) => savePairingAnswers(data),
    onSuccess: () => {
      router.push("/question");
    },
    onError: () => {},
  });

  const handleSubmit = () => {
    if (!isValid || !selectedIncome) {
      return;
    }

    const carBudget = (parseInt(carPrice.trim()) * 10000000).toString();

    const dateBudgetNum = parseInt(datePrice.trim());
    const shoesBudgetNum = parseInt(shoePrice.trim());

    if (isNaN(dateBudgetNum) || isNaN(shoesBudgetNum)) {
      return;
    }

    const dateBudget = dateBudgetNum * 10000;
    const shoesBudget = shoesBudgetNum * 10000;
    const preferredCity = `${selectedCity} ${selectedDistrict}`.trim();
    const idealIncomeRange = pairingIncomeUtils.optionToEnum(selectedIncome);

    const data: PairingAnswersData = {
      car_budget: carBudget,
      dateBudget,
      shoesBudget,
      preferredCity,
      idealIncomeRange,
    };

    mutation.mutate(data);
  };

  return (
    <div className="px-4 space-y-6 bg-hanagreen-normal min-h-screen">
      <Header title="페어링북" className="bg-hanagreen-normal" color="white" />

      <InfoCard
        content={
          <>
            페어링북 문항에 {nickname || "회원"}님의{" "}
            <span className="text-hanagreen-normal">경제 가치관</span>을
            담아보세요!
          </>
        }
        imageType={"infoStarBoy"}
      />

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
          city={selectedCity}
          district={selectedDistrict}
          onChangeCity={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDistrict("");
          }}
          onChangeDistrict={(e) => setSelectedDistrict(e.target.value)}
        />
      </QuestionCard>

      <QuestionCard index={3} question="내가 생각하는 이상적인 부부 월수입은?">
        <div className="flex flex-wrap gap-2">
          {PairingIncomeOptions.map((option) => (
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

      <div className="pt-6 pb-12">
        <Button
          intent={isValid ? "black" : "default"}
          size="full"
          label={mutation.isPending ? "저장 중..." : "완료"}
          onClick={handleSubmit}
          disabled={!isValid || mutation.isPending}
        />
      </div>
    </div>
  );
}
