import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      black: string;
      white: string;
      red: string;
      blue: string;
    };
  }
}
