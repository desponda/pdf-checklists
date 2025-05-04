import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme, media } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';

const ThemeProvider = ({ children }) => {
  // Combine theme and media objects for styled-components
  const completeTheme = {
    ...theme,
    media
  };

  return (
    <StyledThemeProvider theme={completeTheme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;
