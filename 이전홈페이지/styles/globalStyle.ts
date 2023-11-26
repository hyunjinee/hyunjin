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
    background-color: #13111A; // temp
    font-size: 10px;
    font-weight: 900;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;

    box-sizing: border-box;

    -ms-overflow-style: none;
    scrollbar-width: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  @font-face {
    font-family: 'Thicccboi';
    src: url('assets/fonts/THICCCBOI-Regular.ttf');
    src: url('assets/fonts/THICCCBOI-Bold.ttf');
  }
`;
