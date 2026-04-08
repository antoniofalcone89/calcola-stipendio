import { useState, useCallback, useMemo } from "react";
import { format, parseISO, endOfMonth } from "date-fns";
import { it } from "date-fns/locale";
import { Box } from "../ui/layout";
import { Typography } from "../ui/data-display";
import { Paper } from "../ui/surfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "../ui/data-display";
import { IconButton, Button } from "../ui/buttons";
import { TextField } from "../ui/forms";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatTimeFromHours, convertTimeToHours } from "../../utils/timeUtils";
import { isValidTimeFormat } from "../../utils/validationUtils";
import EditHoursDialog from "../EditHoursDialog";
import DeleteConfirmDialog from "../DeleteConfirmDialog";

const formatError =
  "Formato non valido. Usa HH.mm oppure H (es: 08.30 oppure 8)";

const MonthDetail = ({
  month,
  oreLavorate,
  saveHours,
  removeHours,
  pagaOraria,
  onBack,
}) => {
  const [newDate, setNewDate] = useState(`${month}-01`);
  const [newHours, setNewHours] = useState("");
  const [addError, setAddError] = useState("");

  const [editingDate, setEditingDate] = useState(null);
  const [editingHours, setEditingHours] = useState("");
  const [editError, setEditError] = useState("");

  const [deleteDate, setDeleteDate] = useState(null);

  const minDate = `${month}-01`;
  const maxDate = format(
    endOfMonth(parseISO(`${month}-01`)),
    "yyyy-MM-dd"
  );

  const monthDays = useMemo(() => {
    return Object.entries(oreLavorate || {})
      .filter(([date]) => date.startsWith(month))
      .sort(([a], [b]) => a.localeCompare(b));
  }, [oreLavorate, month]);

  const totalHours = useMemo(
    () => monthDays.reduce((acc, [, hours]) => acc + hours, 0),
    [monthDays]
  );

  const handleAdd = () => {
    if (!newHours) {
      setAddError("Inserisci le ore lavorate");
      return;
    }
    if (!isValidTimeFormat(newHours)) {
      setAddError(formatError);
      return;
    }
    const hours = convertTimeToHours(newHours);
    if (!isNaN(hours)) {
      saveHours(newDate, hours);
      setNewHours("");
      setAddError("");
    }
  };

  const handleEditOpen = (date) => {
    setEditingDate(date);
    setEditingHours(formatTimeFromHours(oreLavorate[date]));
    setEditError("");
  };

  const handleSaveEdit = () => {
    if (!editingHours) {
      setEditError("Inserisci le ore lavorate");
      return;
    }
    if (!isValidTimeFormat(editingHours)) {
      setEditError(formatError);
      return;
    }
    const hours = convertTimeToHours(editingHours);
    if (!isNaN(hours)) {
      saveHours(editingDate, hours);
      setEditingDate(null);
      setEditingHours("");
      setEditError("");
    }
  };

  const handleCloseEdit = () => {
    setEditingDate(null);
    setEditingHours("");
    setEditError("");
  };

  const handleDelete = useCallback(
    (date) => {
      removeHours(date);
      setDeleteDate(null);
    },
    [removeHours]
  );

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
        <IconButton onClick={onBack} className="button-icon">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
            fontSize: "2rem",
            color: "rgb(189, 94, 0)",
          }}
        >
          {format(parseISO(`${month}-01`), "MMMM yyyy", { locale: it })}
        </Typography>
        <Box style={{ width: 44 }} />
      </Box>

      {/* Add entry */}
      <Paper
        elevation="md"
        style={{
          padding: "32px",
          marginBottom: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Typography
          variant="h6"
          className="text-secondary"
          style={{ marginBottom: 16 }}
        >
          Aggiungi giornata
        </Typography>
        <TextField
          fullWidth
          label="Data"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          min={minDate}
          max={maxDate}
          className="input-field"
        />
        <TextField
          fullWidth
          label="Ore lavorate"
          type="text"
          value={newHours}
          onChange={(e) => setNewHours(e.target.value)}
          placeholder="08.30"
          error={!!addError}
          helperText={addError}
          className="input-field"
          inputMode="decimal"
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          className="button-primary"
          fullWidth
        >
          Salva ore
        </Button>
      </Paper>

      {/* Day list */}
      <Paper
        elevation="md"
        style={{
          padding: "32px",
          marginBottom: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Typography
          variant="h6"
          className="text-secondary"
          style={{ marginBottom: 8 }}
        >
          Riepilogo del mese
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  className="font-bold text-primary"
                  style={{ width: "100%" }}
                >
                  Data
                </TableCell>
                <TableCell align="right" className="font-bold text-primary">
                  Ore
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthDays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography
                      variant="body2"
                      style={{ color: "#999", textAlign: "center" }}
                    >
                      Nessuna giornata registrata
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                monthDays.map(([date, hours]) => (
                  <TableRow key={date}>
                    <TableCell style={{ width: "40%" }}>
                      {format(parseISO(date), "dd/MM/yy", { locale: it })}
                    </TableCell>
                    <TableCell align="right" style={{ width: "60%" }}>
                      {formatTimeFromHours(hours)}
                      <IconButton
                        size="small"
                        onClick={() => handleEditOpen(date)}
                        className="button-icon"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteDate(date)}
                        className="button-icon text-error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Totals */}
      <Paper
        elevation="md"
        style={{ padding: "32px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        <Typography variant="h6" gutterBottom className="text-secondary">
          Totali
        </Typography>
        <Typography className="text-primary text-lg">
          Ore totali: {formatTimeFromHours(totalHours)}
        </Typography>
        <Typography className="text-primary text-lg font-bold">
          Stipendio stimato: €{(totalHours * (pagaOraria || 0)).toFixed(2)}
        </Typography>
        <Typography
          variant="body2"
          style={{ color: "#666", fontStyle: "italic", marginTop: 8 }}
        >
          Calcolato in base alla tariffa oraria attuale (€{pagaOraria}/ora).
          Variazioni passate non vengono considerate.
        </Typography>
      </Paper>

      <EditHoursDialog
        open={!!editingDate}
        editingHours={editingHours}
        onHoursChange={setEditingHours}
        error={editError}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmDialog
        open={!!deleteDate}
        onClose={() => setDeleteDate(null)}
        onConfirm={() => handleDelete(deleteDate)}
      />
    </Box>
  );
};

export default MonthDetail;
