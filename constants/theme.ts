export const theme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#2C3E50',
    secondaryText: '#7F8C8D',
    border: '#E0E0E0',
    error: '#E74C3C',
    warning: '#F39C12',
    success: '#2ECC71',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      color: '#7F8C8D',
    },
  },
} as const;

export type Theme = typeof theme;
