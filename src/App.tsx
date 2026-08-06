import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { HeaderProvider } from './contexts/HeaderContext';
import { router } from './routes';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <HeaderProvider>
        <GlobalStyle />
        <RouterProvider router={router} />
      </HeaderProvider>
    </ThemeProvider>
  );
};
export default App;
