import { useState } from "react";
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

/**
 * Main component for salary calculator
 * Single Responsibility: Orchestrate all sub-components and manage high-level state
 */
const CalcolatoreStipendio = () => {
  const [pagaOraria, setPagaOraria] = usePagaOraria();
  const { oreLavorate, saveHours, removeHours, removeAllHours } = useOreLavorate();
  
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

  const meseCorrente = format(new Date(), "MMMM yyyy", { locale: it });

  const totaleOre = Object.values(oreLavorate).reduce(
    (acc, ore) => acc + ore,
    0
  );
  const totaleStipendio = totaleOre * pagaOraria;

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
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            color: theme.palette.primary.main,
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Calcolatore Stipendio - {meseCorrente}
        </Typography>

        <Paper
          elevation={3}
          sx={{ p: 4, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Grid container spacing={3}>
            <HourlyRateInput
              pagaOraria={pagaOraria}
              onPagaOrariaChange={setPagaOraria}
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
