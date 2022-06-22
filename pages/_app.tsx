import { useState } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import styled, { ThemeProvider } from 'styled-components';

import ScrollObserver from 'contexts/scrollObserver';
import { GlobalStyle } from 'styles/globalStyle';
import { darkTheme, lightTheme } from 'styles/theme';

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('dark');

  const handleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <>
      <Head>
        <title>HYUNJIN LEE | 이현진</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyle />
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {/* <ThemeToggle onClick={handleTheme}>
          {theme === 'dark' ? 'DARK' : 'LIGHT'}
        </ThemeToggle> */}
        <ScrollObserver>
          <Component {...pageProps} />
        </ScrollObserver>
      </ThemeProvider>
    </>
  );
}

const ThemeToggle = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 999;

  font-size: 1.5rem;
  font-weight: bold;

  color: ${({ theme }) => theme.color.white};

  /* transition: 0.3s; */
  &:hover {
    transition: 0.3s;
    color: ${({ theme }) => theme.color.blue};
  }

  cursor: pointer;
`;

export default MyApp;
