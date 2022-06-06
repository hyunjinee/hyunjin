import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from 'styles/theme';
import Slider from './Slider';

export default {
  title: 'Components/Slider',
  coponent: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Slider {...args} />
    </ThemeProvider>
  );
};

export const EXAMPLE1 = Template.bind({});
