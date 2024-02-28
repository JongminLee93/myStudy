import ColumnChartGroupContainer from '@/stories/column/ColumnChartGroupContainer'
import type { Meta, StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/column/column chart group',
  component: ColumnChartGroupContainer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: 0,
        max: 1200,
      }
    },
    height: {
      control: {
        type: 'range',
        min: 0,
        max: 1200,
      }
    },
    marginLeft: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      }
    },
    marginRight: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      }
    },
    marginTop: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      }
    },
    marginBottom: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
      }
    },
    sources: {
      control: {
        type: 'multi-select',
      },
      options: [
        "기타 면오염원",
        "농업",
        "도로이동오염원",
        "비도로이동오염원",
        "비산먼지",
        "비산업 연소",
        "생물성 연소",
        "생산공정",
        "에너지산업 연소",
        "에너지수송 및 저장",
        "유기용제 사용",
        "제조업 연소",
        "폐기물처리"
      ]
    }
  }
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof ColumnChartGroupContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = require('/public/data/capss/southEastern-yearly.json');

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    sido: '부산광역시',
    pollutant: 'PM10',
    data: data,
  },
};

export const SelectSource: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    sido: '부산광역시',
    pollutant: 'PM10',
    sources: ['기타 면오염원'],
    data: data,
  },
};

export const NoData: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    sido: '부산광역시',
    pollutant: 'PM10',
    // data: [],
  },
};