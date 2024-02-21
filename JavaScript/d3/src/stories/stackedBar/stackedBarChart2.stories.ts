import type { Meta, StoryObj } from '@storybook/react';

import StackedBarChartContainer from './StackedBarChartContainer2';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/bar/stacked bar chart custom',
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
  }
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof StackedBarChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Data {
  name: string;
  source: string;
  value: number;
}

const refineData = (data: any, pollutant: string): Data[] | undefined => {
  if (data === undefined)
    return undefined

  let refinedData = data.reduce((acc: any[], item: any) => {
    const { sido, sigungu, source_main, key, ...rest } = item;
    const value = rest[pollutant];

    if (sigungu) {
      if (!acc.some(i => i.name === sigungu && i.source === source_main)) {
        acc.push({
          name: sigungu,
          source: source_main,
          value: 0,
        })
      }

      acc.find(i => i.name === sigungu && i.source === source_main)['value'] += value;

      return acc;
    }

    if (!acc.some(i => i.name === sido && i.source === source_main)) {
      acc.push({
        name: sido,
        source: source_main,
        value: 0,
      })
    }

    acc.find(i => i.name === sido && i.source === source_main)['value'] += value;

    return acc;

  }, [])

  return refinedData.sort(((a: any, b: any) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
}

const data = refineData(require('/public/data/capss/Busan-pm10.json'), 'PM10');

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    width: 500,
    height: 200,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
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
    source: '생물성 연소',
    data: data,
  },
};
