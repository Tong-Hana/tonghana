import type { Meta, StoryObj } from "@storybook/react";
import Input from "@/components/common/input/Input";

const meta: Meta<typeof Input> = {
  title: "Common/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    fullWidth: { control: "boolean" },
    variant: {
      control: "radio",
      options: ["outlined", "standard"],
    },
    type: {
      control: "select",
      options: ["text", "number", "email", "password"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "메세지를 입력하세요.",
    fullWidth: true,
    variant: "outlined",
  },
};

export const WithCustomWidth: Story = {
  args: {
    placeholder: "1천만원",
    fullWidth: false,
    variant: "outlined",
    className: "w-60",
    inputClassName: "text-lg font-bold",
  },
};

export const PasswordField: Story = {
  args: {
    placeholder: "비밀번호",
    type: "password",
    fullWidth: false,
    className: "w-72",
  },
};

export const WithUnitSuffix: Story = {
  args: {
    placeholder: "몸무게",
    unit: "kg",
    unitPosition: "end",
    fullWidth: false,
    className: "w-56",
  },
};

export const WithUnitPrefix: Story = {
  args: {
    placeholder: "금액",
    unit: "₩",
    unitPosition: "start",
    fullWidth: false,
    className: "w-56",
  },
};
