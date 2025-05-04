/**
 * Central theme configuration for the application
 * This allows consistent styling across all components
 */

export const theme = {
  colors: {
    primary: '#005bea',
    primaryDark: '#232526',
    background: '#181b22',
    card: '#23272f',
    cardAlt: '#232526',
    border: '#23272f',
    accent: '#00c6fb',
    accent2: '#005bea',
    text: {
      main: '#f3f6fa',
      secondary: '#b0b3b8',
      heading: '#f3f6fa',
      muted: '#8a8f98',
      link: '#00c6fb',
    },
    error: '#DE350B',
    success: '#28a745',
    warning: '#FFAB00',
    info: '#2196f3',
  },
  shadows: {
    small: '0 2px 5px rgba(0, 0, 0, 0.10)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.13)',
    large: '0 8px 32px rgba(0, 0, 0, 0.18)',
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '18px',
    pill: '30px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: {
      h1: '2.2rem',
      h2: '1.5rem',
      h3: '1.2rem',
      h4: '1rem',
    },
    text: {
      small: '0.95rem',
      regular: '1.08rem',
      large: '1.25rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  transitions: {
    default: 'all 0.3s cubic-bezier(.4,0,.2,1)',
    fast: 'all 0.18s cubic-bezier(.4,0,.2,1)',
    slow: 'all 0.5s cubic-bezier(.4,0,.2,1)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px',
  },
};

// Helper for media queries
export const media = {
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  laptop: `@media (max-width: ${theme.breakpoints.laptop})`,
  desktop: `@media (max-width: ${theme.breakpoints.desktop})`,
};
