import { ComponentMeta, ComponentStory } from '@storybook/react';
import Custom404 from '../pages/404';

export default {
  title: 'Pages/404',
  coponent: Custom404,
} as ComponentMeta<typeof Custom404>;

const Template: ComponentStory<typeof Custom404> = (args) => {
  return <Custom404 {...args} />;
};

export const Basic = Template.bind({});
