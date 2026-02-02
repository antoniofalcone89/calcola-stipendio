import { Container, CssBaseline, Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CalcolatoreStipendio from "./components/CalcolatoreStipendio";
import Login from "./components/Login";

const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Container maxWidth="md" sx={{ p: 0 }}>
      <CalcolatoreStipendio />
    </Container>
  );
};

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
