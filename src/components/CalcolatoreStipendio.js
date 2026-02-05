import { useState, useEffect } from "react";
import { Box, Grid } from "./ui/layout";
import { Typography } from "./ui/data-display";
import { Paper } from "./ui/surfaces";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { usePagaOraria } from "../hooks/usePagaOraria";
import { useOreLavorate } from "../hooks/useOreLavorate";
import { useWorkHoursForm, useEditDialog } from "../hooks/useWorkHoursForm";
import HourlyRateInput from "./hourlyRate/HourlyRateInput";
import WorkHoursInput from "./WorkHoursInput";
import SummaryTable from "./summary/SummaryTable";
import TotalSummary from "./summary/TotalSummary";
import EditHoursDialog from "./EditHoursDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import DeleteAllDialog from "./DeleteAllDialog";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";
import { loadTotalsFS, saveTotalsFS } from "../db/firestore";
// Import skeleton components
import HeaderSkeleton from "./skeletons/HeaderSkeleton";
import HourlyRateInputSkeleton from "./skeletons/HourlyRateInputSkeleton";
import WorkHoursInputSkeleton from "./skeletons/WorkHoursInputSkeleton";
import SummaryTableSkeleton from "./skeletons/SummaryTableSkeleton";
import TotalSummarySkeleton from "./skeletons/TotalSummarySkeleton";

/**
 * Main component for salary calculator
 * Single Responsibility: Orchestrate all sub-components and manage high-level state
 */
const CalcolatoreStipendio = () => {
  const { currentUser } = useAuth();
  const {
    pagaOraria,
    setPagaOraria,
    savePagaOraria,
    loading: pagaLoading,
    hasChanged,
  } = usePagaOraria();
  const {
    oreLavorate,
    saveHours,
    removeHours,
    removeAllHours,
    loading: oreLoading,
  } = useOreLavorate();

  const [deleteDate, setDeleteDate] = useState(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [storedTotaleOre, setStoredTotaleOre] = useState(0);
  const [storedTotaleStipendio, setStoredTotaleStipendio] = useState(0);
  const [totalsLoaded, setTotalsLoaded] = useState(false);

  // Wrapper per salvare e aggiornare i totali dopo la modifica
  const saveHoursAndTotals = async (date, hours) => {
    await saveHours(date, hours);
    // Calculate new totals from the updated data (avoids stale closure issue)
    const newOreLavorate = { ...(oreLavorate || {}), [date]: hours };
    const newTotaleOre = Object.values(newOreLavorate).reduce(
      (acc, ore) => acc + ore,
      0,
    );
    const newTotaleStipendio = newTotaleOre * (pagaOraria || 0);
    if (currentUser) {
      await saveTotalsFS(currentUser.uid, newTotaleOre, newTotaleStipendio);
      setStoredTotaleOre(newTotaleOre);
      setStoredTotaleStipendio(newTotaleStipendio);
    }
  };

  const {
    selectedDate,
    setSelectedDate,
    oreOggi,
    setOreOggi,
    error,
    handleSave,
  } = useWorkHoursForm(saveHoursAndTotals);

  const {
    editingDate,
    editingHours,
    setEditingHours,
    error: editError,
    handleEdit,
    handleSaveEdit,
    handleClose,
  } = useEditDialog(oreLavorate, saveHoursAndTotals);

  const meseCorrente = format(new Date(), "MMMM yyyy", { locale: it });

  // Calculate totals with null safety
  const totaleOre =
    pagaOraria !== null && oreLavorate !== null
      ? Object.values(oreLavorate).reduce((acc, ore) => acc + ore, 0)
      : 0;
  const totaleStipendio = totaleOre * (pagaOraria || 0);

  // Load totals from Firestore
  useEffect(() => {
    const loadTotals = async () => {
      try {
        if (currentUser) {
          const t = await loadTotalsFS(currentUser.uid);
          setStoredTotaleOre(t.totaleOre || 0);
          setStoredTotaleStipendio(t.totaleStipendio || 0);
        }
        setTotalsLoaded(true);
      } catch (error) {
        console.error("Error loading totals:", error);
        setTotalsLoaded(true);
      }
    };
    loadTotals();
  }, [currentUser]);

  // Show loading skeleton while data is loading
  if (pagaLoading || oreLoading || !currentUser || !totalsLoaded) {
    return (
      <Box
        className="app-container"
        style={{
          minHeight: "100vh",
          padding: "16px 24px",
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)),
            url('${process.env.PUBLIC_URL}/images/3.webp')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <HeaderSkeleton />

        <Paper
          elevation="md"
          style={{
            padding: "32px",
            marginBottom: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Grid container spacing={3}>
            <HourlyRateInputSkeleton />
            <WorkHoursInputSkeleton />
          </Grid>
        </Paper>

        <Paper
          elevation="md"
          style={{
            padding: "32px",
            marginBottom: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <SummaryTableSkeleton />
        </Paper>

        <Paper
          elevation="md"
          style={{
            padding: "32px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <TotalSummarySkeleton />
        </Paper>
      </Box>
    );
  }

  const handleDelete = async (date) => {
    await removeHours(date);
    setDeleteDate(null);
    // Calculate new totals after removing the entry (avoids stale closure issue)
    const newOreLavorate = { ...(oreLavorate || {}) };
    delete newOreLavorate[date];
    const newTotaleOre = Object.values(newOreLavorate).reduce(
      (acc, ore) => acc + ore,
      0,
    );
    const newTotaleStipendio = newTotaleOre * (pagaOraria || 0);
    if (currentUser) {
      await saveTotalsFS(currentUser.uid, newTotaleOre, newTotaleStipendio);
      setStoredTotaleOre(newTotaleOre);
      setStoredTotaleStipendio(newTotaleStipendio);
    }
  };

  const handleDeleteAll = async () => {
    await removeAllHours();
    setShowDeleteAllDialog(false);
    // After deleting all, totals are 0
    if (currentUser) {
      await saveTotalsFS(currentUser.uid, 0, 0);
      setStoredTotaleOre(0);
      setStoredTotaleStipendio(0);
    }
  };

  return (
    <Box
      className="app-container"
      style={{
        minHeight: "100vh",
        padding: "16px 24px",
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)),
          url('${process.env.PUBLIC_URL}/images/3.webp')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Box className="flex flex-between flex-center mb-4 main-title">
        <Typography
          variant="h4"
          className="text-primary"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
            fontSize: "2rem",
            color: "rgb(189, 94, 0)",
          }}
        >
          Calcolatore Stipendio - {meseCorrente}
        </Typography>
        <UserMenu />
      </Box>

      <Paper
        elevation="md"
        style={{
          padding: "32px",
          marginBottom: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Grid container>
          <HourlyRateInput
            pagaOraria={pagaOraria}
            onPagaOrariaChange={setPagaOraria}
            onSave={async () => {
              await savePagaOraria();
              // Recalculate totals with current pagaOraria
              const currentTotaleOre = oreLavorate
                ? Object.values(oreLavorate).reduce((acc, ore) => acc + ore, 0)
                : 0;
              const newTotaleStipendio = currentTotaleOre * (pagaOraria || 0);
              if (currentUser) {
                await saveTotalsFS(
                  currentUser.uid,
                  currentTotaleOre,
                  newTotaleStipendio,
                );
                setStoredTotaleOre(currentTotaleOre);
                setStoredTotaleStipendio(newTotaleStipendio);
              }
            }}
            disabled={!hasChanged}
          />
          <WorkHoursInput
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            oreOggi={oreOggi}
            onHoursChange={setOreOggi}
            error={error}
            onSave={handleSave}
          />
        </Grid>
      </Paper>

      <Paper
        elevation="md"
        style={{
          padding: "32px",
          marginBottom: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <SummaryTable
          oreLavorate={oreLavorate}
          onEdit={handleEdit}
          onDelete={setDeleteDate}
          onDeleteAll={() => setShowDeleteAllDialog(true)}
        />
      </Paper>

      <Paper
        elevation="md"
        style={{ padding: "32px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <TotalSummary
          totaleOre={
            currentUser && totalsLoaded && oreLavorate === null
              ? storedTotaleOre
              : totaleOre
          }
          totaleStipendio={
            currentUser && totalsLoaded && oreLavorate === null
              ? storedTotaleStipendio
              : totaleStipendio
          }
        />
      </Paper>

      <EditHoursDialog
        open={!!editingDate}
        editingHours={editingHours}
        onHoursChange={setEditingHours}
        error={editError}
        onClose={handleClose}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmDialog
        open={!!deleteDate}
        onClose={() => setDeleteDate(null)}
        onConfirm={() => handleDelete(deleteDate)}
      />

      <DeleteAllDialog
        open={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleDeleteAll}
      />
    </Box>
  );
};

export default CalcolatoreStipendio;
