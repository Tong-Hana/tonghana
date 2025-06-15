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
import { validateEmail, validatePassword } from "@/lib/validators";
import toast from "react-hot-toast";
import { formatYYYYMMDD } from "@/utils/dateformatter";

export default function SignupForm() {
  const [nickname, setNickname] = useState("");

  const [email, setEmail] = useState("");
  const [emailErrMessage, setEmailErrMessage] = useState("");
  const isValidEmail = email && !emailErrMessage;

  const [password, setPassword] = useState("");
  const [pwErrMessage, setPwErrMessage] = useState("");
  const isValidPassword = password && !pwErrMessage;

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
  const allTermAgreed = Object.values(checkedTerms).every(Boolean);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailErrMessage(
      validateEmail(event.target.value) ? "" : "이메일 형식이 맞지 않습니다.",
    );
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPwErrMessage(
      validatePassword(event.target.value)
        ? ""
        : "영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.",
    );
  };

  const handleChangeBirthDay = (value: Date | null) => {
    setBirthday(value);
  };

  const handleSelectGender = (gender: Gender) => {
    setGender(gender);
  };

  const handleChangeCity = (event: SelectChangeEvent) => {
    setCity(event.target.value);
    setDistrict("");
  };

  const handleChangeDistrict = (event: SelectChangeEvent) => {
    setDistrict(event.target.value);
  };

  const handleTermsChange = (updated: Record<string, boolean>) => {
    setCheckedTerms(updated);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !(
        nickname &&
        isValidEmail &&
        isValidPassword &&
        birthday &&
        gender &&
        city &&
        district &&
        allTermAgreed
      )
    ) {
      toast.error("모든 정보들을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          nickname: nickname,
          email: email,
          password: password,
          birthYear: Number(formatYYYYMMDD(birthday)),
          gender: gender,
          city: `${city} ${district}`,
        }),
      });

      if (response.ok) {
        toast.success("회원가입에 성공했습니다.");
        router.push("/login");
      } else {
        toast.error(JSON.parse(await response.text()).message);
      }

      setIsSubmitting(false);
    } catch {
      toast.error("회원가입에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="mt-20 mb-20 flex flex-col w-full justify-center items-center gap-5"
    >
      <InputWithLabel
        id="nickname"
        label={"닉네임"}
        placeholder="닉네임을 입력해주세요"
        value={nickname}
        onChange={handleChangeNickname}
      />
      <InputWithLabel
        label={"이메일"}
        placeholder="이메일을 입력해주세요"
        value={email}
        onChange={handleChangeEmail}
        errorMessage={emailErrMessage}
      />
      <InputWithLabel
        label={"비밀번호"}
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={handleChangePassword}
        errorMessage={pwErrMessage}
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
      <div className="fixed bg-background px-5 py-4 bottom-0 flex w-full gap-3">
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
          disabled={
            !(
              nickname &&
              isValidEmail &&
              isValidPassword &&
              birthday &&
              gender &&
              city &&
              district &&
              allTermAgreed
            )
          }
          loading={isSubmitting}
        />
      </div>
    </form>
  );
}
