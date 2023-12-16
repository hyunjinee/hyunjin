import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from 'styles/theme';
import Slider from './Slider3';

export default {
  title: 'Components/Slider',
  coponent: Slider,
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ width: '100%', height: '100vh' }}>
        <Slider {...args} />
      </div>
    </ThemeProvider>
  );
};

export const EXAMPLE1 = Template.bind({});
