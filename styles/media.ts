import { Media } from 'styled-components';

const mediaQuery = (maxWidth: number) => `@media (max-width: ${maxWidth}px)`;

export const media: Media = {
  tablet: mediaQuery(1234),
  desktop: mediaQuery(1440),
};
