import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import { saveTotalsFS } from "../db/firestore";
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

  const meseCorrente = useMemo(
    () => format(new Date(), "MMMM yyyy", { locale: it }),
    [],
  );

  // Calculate totals with null safety
  const totaleOre = useMemo(
    () =>
      pagaOraria !== null && oreLavorate !== null
        ? Object.values(oreLavorate).reduce((acc, ore) => acc + ore, 0)
        : 0,
    [pagaOraria, oreLavorate],
  );

  const totaleStipendio = useMemo(
    () => totaleOre * (pagaOraria || 0),
    [totaleOre, pagaOraria],
  );

  // Sync totals to Firestore whenever they change
  const prevTotalsRef = useRef({ totaleOre: null, totaleStipendio: null });
  useEffect(() => {
    if (
      currentUser &&
      oreLavorate !== null &&
      pagaOraria !== null &&
      (prevTotalsRef.current.totaleOre !== totaleOre ||
        prevTotalsRef.current.totaleStipendio !== totaleStipendio)
    ) {
      prevTotalsRef.current = { totaleOre, totaleStipendio };
      saveTotalsFS(currentUser.uid, totaleOre, totaleStipendio);
    }
  }, [currentUser, oreLavorate, pagaOraria, totaleOre, totaleStipendio]);

  // Memoized callbacks for handlers
  const handleDelete = useCallback(
    (date) => {
      removeHours(date);
      setDeleteDate(null);
    },
    [removeHours],
  );

  const handleDeleteAll = useCallback(() => {
    removeAllHours();
    setShowDeleteAllDialog(false);
  }, [removeAllHours]);

  const handleCloseMobileDialog = useCallback(() => {
    setDeleteDate(null);
  }, []);

  const handleCloseDeleteAllDialog = useCallback(() => {
    setShowDeleteAllDialog(false);
  }, []);

  const handleShowDeleteAllDialog = useCallback(() => {
    setShowDeleteAllDialog(true);
  }, []);

  const handleSetDeleteDate = useCallback((date) => {
    setDeleteDate(date);
  }, []);

  // Show loading skeleton while data is loading
  if (pagaLoading || oreLoading || !currentUser) {
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
            onSave={savePagaOraria}
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
          key={Object.keys(oreLavorate || {}).join(",")}
          oreLavorate={oreLavorate}
          onEdit={handleEdit}
          onDelete={handleSetDeleteDate}
          onDeleteAll={handleShowDeleteAllDialog}
        />
      </Paper>

      <Paper
        elevation="md"
        style={{ padding: "32px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <TotalSummary
          key={`${totaleOre}-${totaleStipendio}`}
          totaleOre={totaleOre}
          totaleStipendio={totaleStipendio}
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
        onClose={handleCloseMobileDialog}
        onConfirm={() => handleDelete(deleteDate)}
      />

      <DeleteAllDialog
        open={showDeleteAllDialog}
        onClose={handleCloseDeleteAllDialog}
        onConfirm={handleDeleteAll}
      />
    </Box>
  );
};

export default CalcolatoreStipendio;
