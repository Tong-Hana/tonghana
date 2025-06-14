"use client";

import { useRouter } from "next/navigation";
import Button from "../common/button/Button";
import InputWithLabel from "../common/input/InputWithLabel";
import DatePicker from "../common/DatePicker";
import GenderButtonGroup, { Gender } from "../common/GenderButtonGroup";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import AddressSelectGroup from "../common/AddressSelectGroup";
import TermsAgreementGroup from "./TermsAgreementGroup";
import { TERMS } from "@/constants/terms";

export default function SignupForm() {
  const [nickname, setNickname] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [checkedTerms, setCheckedTerms] = useState<Record<string, boolean>>(
    TERMS.reduce(
      (acc, term) => {
        acc[term.id] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );
  // const allTermAgreed = Object.values(checkedTerms).every(Boolean);

  const router = useRouter();

  const handleChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeBirthDay = (value: Date | null) => {
    setBirthday(value);
  };

  const handleSelectGender = (gender: Gender) => {
    setGender(gender);
  };

  const handleChangeCity = (event: SelectChangeEvent) => {
    setCity(event.target.value);
  };

  const handleChangeDistrict = (event: SelectChangeEvent) => {
    setDistrict(event.target.value);
  };

  const handleTermsChange = (updated: Record<string, boolean>) => {
    setCheckedTerms(updated);
  };

  return (
    <form className="mt-10 mb-10 flex flex-col w-full justify-center items-center gap-5">
      <InputWithLabel
        id="nickname"
        label={"닉네임"}
        placeholder="닉네임을 입력해주세요"
        value={nickname}
        onChange={handleChangeNickname}
      />
      <InputWithLabel
        label={"아이디"}
        placeholder="아이디를 입력해주세요"
        value={id}
        onChange={handleChangeId}
      />
      <InputWithLabel
        label={"비밀번호"}
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={handleChangePassword}
      />
      <DatePicker date={birthday} onChange={handleChangeBirthDay} />
      <GenderButtonGroup
        selectedGender={gender}
        onSelect={handleSelectGender}
      />
      <AddressSelectGroup
        city={city}
        district={district}
        onChangeCity={handleChangeCity}
        onChangeDistrict={handleChangeDistrict}
      />
      <TermsAgreementGroup value={checkedTerms} onChange={handleTermsChange} />
      <div className="flex  w-full gap-3">
        <Button
          className="rounded-lg flex-[1_1_0]"
          type="button"
          label="취소"
          intent={"black"}
          size={"full"}
          onClick={() => router.back()}
        />
        <Button
          className="rounded-lg flex-[2_2_0]"
          type="submit"
          label="회원가입"
          intent={"green"}
          size={"full"}
        />
      </div>
    </form>
  );
}
