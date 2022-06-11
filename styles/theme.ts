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
    blue: '#3EFFFF',
    red: '#FF5E5E',
  },
};

export const lightTheme: DefaultTheme = {
  color: {
    black: '#ffffff',
    white: '#000000',
    blue: '#6400ff',
    red: '#00ff50',
  },
};
