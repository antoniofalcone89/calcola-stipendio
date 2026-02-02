import { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, ThemeProvider } from "@mui/material";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { theme } from "../theme/theme";
import { usePagaOraria } from "../hooks/usePagaOraria";
import { useOreLavorate } from "../hooks/useOreLavorate";
import { useWorkHoursForm, useEditDialog } from "../hooks/useWorkHoursForm";
import HourlyRateInput from "./HourlyRateInput";
import WorkHoursInput from "./WorkHoursInput";
import SummaryTable from "./SummaryTable";
import TotalSummary from "./TotalSummary";
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
  const { oreLavorate, saveHours, removeHours, removeAllHours, oreLoading } =
    useOreLavorate();

  const {
    selectedDate,
    setSelectedDate,
    oreOggi,
    setOreOggi,
    error,
    handleSave,
  } = useWorkHoursForm(saveHours);

  const {
    editingDate,
    editingHours,
    setEditingHours,
    error: editError,
    handleEdit,
    handleSaveEdit,
    handleClose,
  } = useEditDialog(oreLavorate, saveHours);

  const [deleteDate, setDeleteDate] = useState(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [storedTotaleOre, setStoredTotaleOre] = useState(0);
  const [storedTotaleStipendio, setStoredTotaleStipendio] = useState(0);
  const [totalsLoaded, setTotalsLoaded] = useState(false);

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

  // Save totals to Firestore
  const saveTotals = async () => {
    if (currentUser) {
      const totaleOre = oreLavorate
        ? Object.values(oreLavorate).reduce((sum, ore) => sum + ore, 0)
        : 0;
      const totaleStipendio = totaleOre * (pagaOraria || 0);
      try {
        await saveTotalsFS(currentUser.uid, totaleOre, totaleStipendio);
        setStoredTotaleOre(totaleOre);
        setStoredTotaleStipendio(totaleStipendio);
      } catch (error) {
        console.error("Error saving totals:", error);
      }
    }
  };

  // Show loading skeleton while data is loading
  if (pagaLoading || oreLoading || !currentUser || !totalsLoaded) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            padding: { xs: 2, sm: 3, md: 4 },
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
            elevation={3}
            sx={{ p: 4, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <Grid container spacing={3}>
              <HourlyRateInputSkeleton />
              <WorkHoursInputSkeleton />
            </Grid>
          </Paper>

          <Paper
            elevation={3}
            sx={{ p: 4, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <SummaryTableSkeleton />
          </Paper>

          <Paper
            elevation={3}
            sx={{ p: 4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <TotalSummarySkeleton />
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  const handleDelete = async (date) => {
    await removeHours(date);
    setDeleteDate(null);
  };

  const handleDeleteAll = async () => {
    await removeAllHours();
    setShowDeleteAllDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          padding: { xs: 2, sm: 3, md: 4 },
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              fontWeight: "bold",
              flex: 1,
              textAlign: "center",
            }}
          >
            Calcolatore Stipendio - {meseCorrente}
          </Typography>
          <UserMenu />
        </Box>

        <Paper
          elevation={3}
          sx={{ p: 4, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Grid container spacing={3}>
            <HourlyRateInput
              pagaOraria={pagaOraria}
              onPagaOrariaChange={setPagaOraria}
              onSave={async () => {
                await savePagaOraria();
                await saveTotals();
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
          elevation={3}
          sx={{ p: 4, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <SummaryTable
            oreLavorate={oreLavorate}
            onEdit={handleEdit}
            onDelete={setDeleteDate}
            onDeleteAll={() => setShowDeleteAllDialog(true)}
          />
        </Paper>

        <Paper
          elevation={3}
          sx={{ p: 4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <TotalSummary
            totaleOre={
              currentUser && totalsLoaded && totaleOre === 0
                ? storedTotaleOre
                : totaleOre
            }
            totaleStipendio={
              currentUser && totalsLoaded && totaleStipendio === 0
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
    </ThemeProvider>
  );
};

export default CalcolatoreStipendio;
