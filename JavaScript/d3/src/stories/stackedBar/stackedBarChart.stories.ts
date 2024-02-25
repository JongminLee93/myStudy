import type { Meta, StoryObj } from '@storybook/react';

import StackedBarChartContainer from './StackedBarChartContainer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/bar/stacked bar chart',
  component: StackedBarChartContainer,
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
    pollutant: {
      control: {
        type: 'select'
      },
      options: [
        "CO",
        "NOx",
        "SOx",
        "TSP",
        "PM10",
        "PM2P5",
        "VOC",
        "NH3",
        "BC",
      ]
    },
    selectedSources: {
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
} satisfies Meta<typeof StackedBarChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = require('/public/data/capss/Busan-pm10.json');

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    pollutant: 'PM10',
    xAxisLabel: '연간 배출량 (ton)',
    data: data,
  },
};

export const SourceSelected: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    pollutant: 'PM10',
    selectedSources: ['생물성 연소'],
    xAxisLabel: '연간 배출량 (ton)',
    data: data,
  },
};
