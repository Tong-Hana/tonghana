import type { Meta, StoryObj } from "@storybook/react";
import Tag from "@/components/common/tag/Tag";

const meta: Meta<typeof Tag> = {
  title: "Common/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "태그에 표시될 텍스트",
    },
    variant: {
      control: "select",
      options: ["filled", "outlined", "interactive", "selected"],
      description: "태그의 스타일 variant",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "태그의 크기",
    },
    selectable: {
      control: "boolean",
      description: "클릭 가능한 태그 여부",
    },
    selected: {
      control: "boolean",
      description: "선택된 상태 (selectable이 true일 때만 적용)",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    onClick: {
      action: "clicked",
      description: "클릭 이벤트 핸들러",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 정적 태그 (filled)
export const Default: Story = {
  args: {
    text: "기본 태그",
    variant: "filled",
    size: "md",
    selectable: false,
  },
};

// 정적 태그 - Filled
export const StaticFilled: Story = {
  args: {
    text: "자가 보유",
    variant: "filled",
    size: "md",
    selectable: false,
  },
};

// 정적 태그 - Outlined
export const StaticOutlined: Story = {
  args: {
    text: "적극투자 선호",
    variant: "outlined",
    size: "md",
    selectable: false,
  },
};

// 선택 가능한 태그 (기본 상태)
export const SelectableDefault: Story = {
  args: {
    text: "내 집 마련",
    size: "md",
    selectable: true,
    selected: false,
  },
};

// 선택 가능한 태그 (선택된 상태)
export const SelectableSelected: Story = {
  args: {
    text: "선택된 태그",
    size: "md",
    selectable: true,
    selected: true,
  },
};

// 비활성화된 정적 태그
export const StaticDisabled: Story = {
  args: {
    text: "비활성화 태그",
    variant: "filled",
    size: "md",
    selectable: false,
    disabled: true,
  },
};

// 비활성화된 선택 가능한 태그
export const SelectableDisabled: Story = {
  args: {
    text: "선택 불가",
    size: "md",
    selectable: true,
    selected: false,
    disabled: true,
  },
};

// 모든 크기 테스트
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Tag text="XS" size="xs" selectable={false} />
      <Tag text="Small" size="sm" selectable={false} />
      <Tag text="Medium" size="md" selectable={false} />
      <Tag text="Large" size="lg" selectable={false} />
      <Tag text="Extra Large" size="xl" selectable={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "태그의 모든 크기를 비교해볼 수 있습니다.",
      },
    },
  },
};

// 모든 variant 테스트용
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag text="Filled" variant="filled" selectable={false} />
      <Tag text="Outlined" variant="outlined" selectable={false} />
      <Tag text="Interactive" selectable={true} selected={false} />
      <Tag text="Selected" selectable={true} selected={true} />
      <Tag
        text="Disabled"
        variant="filled"
        selectable={false}
        disabled={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 태그 variant를 한 번에 확인할 수 있습니다.",
      },
    },
  },
};

// 실제 사용 시나리오 - 필터 태그들
export const FilterScenario: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">투자 성향</h3>
        <div className="flex flex-wrap gap-2">
          <Tag
            text="안전투자 선호"
            selectable={true}
            selected={true}
            size="sm"
          />
          <Tag
            text="적극투자 선호"
            selectable={true}
            selected={false}
            size="sm"
          />
          <Tag
            text="고수익 추구"
            selectable={true}
            selected={false}
            size="sm"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">보유 자산</h3>
        <div className="flex flex-wrap gap-2">
          <Tag text="자가 보유" selectable={true} selected={false} size="sm" />
          <Tag text="전세" selectable={true} selected={true} size="sm" />
          <Tag text="월세" selectable={true} selected={false} size="sm" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "실제 필터 기능에서 사용되는 태그들의 예시입니다.",
      },
    },
  },
};

// 카테고리 라벨 시나리오
export const CategoryScenario: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          상품 카테고리
        </h3>
        <div className="flex flex-wrap gap-2">
          <Tag text="NEW" variant="filled" size="xs" selectable={false} />
          <Tag text="BEST" variant="outlined" size="sm" selectable={false} />
          <Tag text="적금" variant="filled" size="md" selectable={false} />
          <Tag text="예금" variant="outlined" size="md" selectable={false} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "상품 카테고리나 라벨용 태그들의 예시입니다.",
      },
    },
  },
};
