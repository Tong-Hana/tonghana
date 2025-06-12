import type { Meta, StoryObj } from "@storybook/nextjs";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  argTypes: {
    intent: {
      control: { type: "select" },
      options: ["default", "black", "green", "red"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "ml", "lg", "full"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    intent: "default",
    size: "md",
    label: "기본 버튼",
  },
};

export const GreenFull: Story = {
  args: {
    intent: "green",
    size: "full",
    label: "확인",
  },
};

export const Loading: Story = {
  args: {
    intent: "green",
    size: "md",
    loading: true,
    label: "처리중",
  },
};

export const WithChildren: Story = {
  render: () => (
    <Button intent="black" size="md">
      <span>👋 커스텀 콘텐츠</span>
    </Button>
  ),
};
