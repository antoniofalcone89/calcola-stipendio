import { useState } from "react";
import { Box } from "./components/ui/layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CalcolatoreStipendio from "./components/CalcolatoreStipendio";
import HistoryPage from "./components/history/HistoryPage";
import Login from "./components/Login";
import { useOreLavorate } from "./hooks/useOreLavorate";
import { usePagaOraria } from "./hooks/usePagaOraria";
import "../src/css/index.css";

const AppContent = () => {
  const { currentUser, loading } = useAuth();
  const [view, setView] = useState("calculator");
  const oreHook = useOreLavorate();
  const pagaHook = usePagaOraria();

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

  if (view === "history") {
    return (
      <Box className="container-md">
        <HistoryPage
          oreLavorate={oreHook.oreLavorate}
          saveHours={oreHook.saveHours}
          removeHours={oreHook.removeHours}
          pagaOraria={pagaHook.pagaOraria}
          loading={oreHook.loading || pagaHook.loading}
          onNavigate={setView}
        />
      </Box>
    );
  }

  return (
    <Box className="container-md">
      <CalcolatoreStipendio
        oreLavorate={oreHook.oreLavorate}
        saveHours={oreHook.saveHours}
        removeHours={oreHook.removeHours}
        removeAllHours={oreHook.removeAllHours}
        oreLoading={oreHook.loading}
        pagaOraria={pagaHook.pagaOraria}
        setPagaOraria={pagaHook.setPagaOraria}
        savePagaOraria={pagaHook.savePagaOraria}
        pagaLoading={pagaHook.loading}
        hasChanged={pagaHook.hasChanged}
        onNavigate={setView}
      />
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
