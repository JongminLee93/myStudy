import type { Meta, StoryObj } from '@storybook/react';
//@ts-ignore
import rewind from '@turf/rewind'

import Map from './Map';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/Map',
  component: Map,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  
} satisfies Meta<typeof Map>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
const seJson = rewind(require('/public/data/newMap/SouthEastern.json'), { reverse: true })
const background = rewind(require('/public/data/background.json'), { reverse: true })

export const south_eastern: Story = {
  args: {
    width: 800,
    height: 800,
    data: seJson,
    backgroundData: background,
    year: 2020,
    pollutant: 'PM10',
  },
};
