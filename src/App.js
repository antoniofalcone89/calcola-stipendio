import { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import CalcolatoreStipendio from './components/CalcolatoreStipendio';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D35400',
    },
    secondary: {
      main: '#8E4B10',
    },
    background: {
      default: '#FFF5E6',
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <CalcolatoreStipendio />
      </Container>
    </ThemeProvider>
  );
}

export default App;