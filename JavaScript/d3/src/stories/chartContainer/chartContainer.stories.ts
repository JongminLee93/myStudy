import type { Meta, StoryObj } from '@storybook/react';

import ChartContainer from './ChartContainer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/chart container',
  component: ChartContainer,
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
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
  },
};
