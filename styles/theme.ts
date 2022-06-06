import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 0 4.2rem;
  max-width: 144rem;
`;

export const darkTheme: DefaultTheme = {
  color: {
    black: '#000000',
    white: '#ffffff',
  },
};

export const lightTheme: DefaultTheme = {
  color: {
    black: '#ffffff',
    white: '#000000',
  },
};
