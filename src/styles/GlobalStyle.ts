import { createGlobalStyle, keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;

export const popIn = keyframes`
  from { opacity: 0; transform: translateY(14px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.04); }
`;

export const GlobalStyle = createGlobalStyle`
  /* Reset & Base */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    background-color: #F0EDE4;  /* Mobile Frame Background */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    overflow-x: hidden;
  }

  body.modal-open {
    overflow: hidden;
  }

  button {
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input, textarea, select {
    font: inherit;
    border: none;
    outline: none;
    background: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  ul, ol, li {
    list-style: none;
  }

  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .text-center { text-align: center; }
  .text-right  { text-align: right; }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive Variables */
  @media (max-width: 390px) {
    :root {
      --btn-height: 52px;
      --input-height: 48px;
      --header-height: 56px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
