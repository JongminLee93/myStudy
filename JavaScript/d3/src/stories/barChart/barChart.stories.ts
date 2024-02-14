import type { Meta, StoryObj } from '@storybook/react';

import BarChartContainer from './BarChartContainer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/bar chart',
  component: BarChartContainer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
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
        max: 800,
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
  }
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof BarChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateData = (numOfData: number) => {
  return Array(numOfData).fill({}).map((_,i) => ({
    name: `data name ${i}`,
    value: Math.random()*100000,
  }))
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    data: generateData(Math.round(Math.random()*8 + 2))
  },
};
