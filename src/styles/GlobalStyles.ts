import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button, input {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 4px;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary}40; /* 40 is for 25% opacity */
    color: ${({ theme }) => theme.colors.text};
  }

  /* Set margin: initial; for all headings */
  h1, h2, h3, h4, h5, h6 {
    margin: initial;
  }
`;

export default GlobalStyles;