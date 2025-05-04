import { createGlobalStyle } from 'styled-components';
import { fadeIn, spin } from './animations';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(120deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
    color: ${({ theme }) => theme.colors.text.main};
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: transparent;
  }

  button {
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
    color: ${({ theme }) => theme.colors.text.main};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.text.regular};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    
    &:hover:not(:disabled) {
      background: linear-gradient(90deg, ${({ theme }) => theme.colors.primaryDark} 0%, ${({ theme }) => theme.colors.primary} 100%);
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  /* Core layout */
  .main-content {
    flex: 1;
    max-width: 1200px;
    margin: ${({ theme }) => theme.spacing.lg} auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  .section {
    background-color: ${({ theme }) => theme.colors.surface.primary};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }

  .section-title {
    font-size: ${({ theme }) => theme.typography.heading.h2};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.heading};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  /* Form elements */
  input,
  select,
  textarea {
    background: ${({ theme }) => theme.colors.surface.secondary} !important;
    color: ${({ theme }) => theme.colors.text.main} !important;
    border: 1px solid ${({ theme }) => theme.colors.border} !important;
    border-radius: ${({ theme }) => theme.borderRadius.small} !important;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.text.regular};
    transition: ${({ theme }) => theme.transitions.fast};

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary} !important;
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
    }
  }

  /* Loading states */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: ${({ theme }) => theme.typography.text.large};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid ${({ theme }) => theme.colors.text.muted}33;
    border-radius: 50%;
    border-top-color: ${({ theme }) => theme.colors.text.main};
    animation: ${spin} 1s linear infinite;
  }
`;

export default GlobalStyle;
