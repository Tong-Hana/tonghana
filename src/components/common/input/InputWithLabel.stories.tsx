import type { Meta, StoryObj } from "@storybook/react";
import InputWithLabel from "@/components/common/input/InputWithLabel";
import { useState } from "react";

const meta: Meta<typeof InputWithLabel> = {
  title: "Common/InputWithLabel",
  component: InputWithLabel,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    errorMessage: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof InputWithLabel>;

export const Default: Story = {
  args: {
    label: "닉네임",
    placeholder: "닉네임을 입력해주세요",
    required: false,
  },
};

export const Required: Story = {
  args: {
    label: "한 줄 소개",
    placeholder: "성수에 살고 분당에서 일해요",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: "한 줄 소개",
    placeholder: "성수에 살고 분당에서 일해요",
    required: true,
    errorMessage: "내용을 입력해주세요",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <InputWithLabel
        label="한 줄 소개"
        placeholder="성수에 살고 분당에서 일해요"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        errorMessage={value.length === 0 ? "필수 입력입니다." : ""}
      />
    );
  },
};
