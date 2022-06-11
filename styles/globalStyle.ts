import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  ::-webkit-scrollbar {
        display: none;
  }

  html, body {
    width: 100%;
    height: 100vh;
    /* min-width: 1440px; */

    font-size: 62.5%; // 1rem === 10px
    font-weight: 900;
    font-family: "SF Pro Display", Poppins, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;

    box-sizing: border-box;

    -ms-overflow-style: none;
        scrollbar-width: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
  }


`;
