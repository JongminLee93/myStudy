import type { Meta, StoryObj } from '@storybook/react';
//@ts-ignore
import rewind from '@turf/rewind'

import MapContainer from './component/MapContainer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'd3/map',
  component: MapContainer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    year: {
      control: 'select',
      options: [2020, 2019, 2018, 2017, 2016]
    },
    pollutant: {
      control: 'select',
      options: ['PM10', 'PM2P5', 'BC', 'SOx', 'NOx', 'CO', 'NH3', 'TSP', 'VOC']
    },
  }
} satisfies Meta<typeof MapContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    width: 800,
    height: 800,
    mapMarginLeft: 20,
    mapMarginRight: 20,
    mapMarginTop: 20,
    mapMarginBottom: 20,
    year: 2020,
    pollutant: 'PM10',
  },
};
