import { Container, CssBaseline } from '@mui/material';
import CalcolatoreStipendio from './components/CalcolatoreStipendio';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ p: 0 }}>
        <CalcolatoreStipendio />
      </Container>
    </>
  );
}

export default App;