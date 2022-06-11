import Breakpoints from 'constants/breakpoints';

const { xlarge, large, medium, small, xSmall } = Breakpoints;

const mediaQuery = (maxWidth: number) => `@media (max-width: ${maxWidth}px)`;

export const media = {
  xSmall: mediaQuery(xSmall),
  small: mediaQuery(small),
  mobile: mediaQuery(medium),
  tablet: mediaQuery(1234),
  desktop: mediaQuery(1440),
};
