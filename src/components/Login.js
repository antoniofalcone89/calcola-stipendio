import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  ThemeProvider,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/theme';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Errore durante il login. Riprova.');
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)),
            url('${process.env.PUBLIC_URL}/images/3.webp')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          padding: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            maxWidth: 400,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              Calcolatore Stipendio
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              Accedi per continuare
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #4285F4, #34A853)',
              '&:hover': {
                background: 'linear-gradient(135deg, #357AE8, #2E7D32)',
              },
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi con Google'}
          </Button>

          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 3,
              textAlign: 'center',
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
            }}
          >
            Utilizzando Google, accetti i termini di servizio
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
