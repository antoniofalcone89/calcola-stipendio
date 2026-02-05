import { Box } from "./components/ui/layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CalcolatoreStipendio from "./components/CalcolatoreStipendio";
import Login from "./components/Login";
import "../src/css/index.css";

const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box className="flex flex-center" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
      </Box>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Box className="container-md">
      <CalcolatoreStipendio />
    </Box>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
