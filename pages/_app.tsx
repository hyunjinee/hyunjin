import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
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
        <ThemeToggle onClick={handleTheme}>
          {theme === 'dark' ? '🌙' : '🌞'}
        </ThemeToggle>
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
  transition: 1s;

  cursor: pointer;
`;

export default MyApp;
