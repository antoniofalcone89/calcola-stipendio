import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  saveOreLavorate,
  loadOreLavorate,
  savePagaOraria,
  loadPagaOraria,
  deleteOreLavorate,
  deleteAllOreLavorate,
} from "../db/database";
import {
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
} from "@mui/icons-material";

// Update theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#953c00ff", 
      light: "#E67E22",
    },
    secondary: {
      main: "#8E4B10", 
      light: "#B65C20",
    },
    background: {
      default: "#FFF5E6", 
      paper: "rgba(255, 245, 230, 0.9)",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(211, 84, 0, 0.15)",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 245, 230, 0.85) !important",
          border: "1px solid rgba(211, 84, 0, 0.2)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: "linear-gradient(135deg,rgb(0, 211, 127),rgb(10, 142, 19))",
          color: "#fff",
          fontWeight: 600,
          "&:hover": {
            background: "linear-gradient(135deg, #F39C12, #D35400)",
          },
        },
        text: {
          color: "#D35400",
          "&:hover": {
            backgroundColor: "rgba(211, 84, 0, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(169, 65, 0, 0.7)",
            },
            "&:hover fieldset": {
              borderColor: "#D35400",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#D35400",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#D35400",
            "&.Mui-focused": {
              color: "#D35400",
            },
          },
          "& .MuiInputBase-input": {
            "&::placeholder": {
              color: "rgba(211, 84, 0, 0.7)",
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(211, 84, 0, 0.05) !important",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#D35400",
          "&:hover": {
            backgroundColor: "rgba(0, 211, 116, 0.1)",
          },
        },
      },
    },
  },
});

function CalcolatoreStipendio() {
  const [pagaOraria, setPagaOraria] = useState(() => {
    const stored = localStorage.getItem("pagaOraria");
    const val = stored !== null ? parseFloat(stored) : NaN;
    return Number.isFinite(val) ? val : 10;
  });
  const [oreLavorate, setOreLavorate] = useState({});
  const [oreOggi, setOreOggi] = useState("");
  const [editingDate, setEditingDate] = useState(null);
  const [editingHours, setEditingHours] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [error, setError] = useState("");
  const [deleteDate, setDeleteDate] = useState(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const giornoCorrente = format(new Date(), "yyyy-MM-dd");
  const meseCorrente = format(new Date(), "MMMM yyyy", { locale: it });

  const isValidTimeFormat = (time) => {
    return /^([0-1]?[0-9]|2[0-3])\.[0-5][0-9]$/.test(time);
  };

  const convertTimeToHours = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(".").map(Number);
    return hours + minutes / 60;
  };

  const formatTimeFromHours = (hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours.toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")}`;
  };

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const savedOre = await loadOreLavorate();
      const savedPagaOraria = await loadPagaOraria();

      setOreLavorate(savedOre);
      setPagaOraria(savedPagaOraria);
    };

    loadData();
  }, []);

  // Save pagaOraria when it changes
  useEffect(() => {
    savePagaOraria(pagaOraria);
  }, [pagaOraria]);

  const salvaOreOggi = async () => {
    if (!oreOggi) {
      setError("Inserisci le ore lavorate");
      return;
    }

    if (!isValidTimeFormat(oreOggi)) {
      setError("Formato ore non valido. Usa HH.mm (es: 08.30)");
      return;
    }

    const hours = convertTimeToHours(oreOggi);
    if (!isNaN(hours)) {
      setOreLavorate((prev) => ({
        ...prev,
        [selectedDate]: hours,
      }));

      await saveOreLavorate(selectedDate, hours);
      setOreOggi("");
      setError("");
    }
  };

  const handleEdit = (data) => {
    setEditingDate(data);
    setEditingHours(formatTimeFromHours(oreLavorate[data]));
    setError("");
  };

  const handleSaveEdit = async () => {
    if (!editingHours) {
      setError("Inserisci le ore lavorate");
      return;
    }

    if (!isValidTimeFormat(editingHours)) {
      setError("Formato ore non valido. Usa HH.mm (es: 08.30)");
      return;
    }

    const hours = convertTimeToHours(editingHours);
    if (!isNaN(hours)) {
      setOreLavorate((prev) => ({
        ...prev,
        [editingDate]: hours,
      }));

      await saveOreLavorate(editingDate, hours);
      setEditingDate(null);
      setEditingHours("");
      setError("");
    }
  };

  const totaleOre = Object.values(oreLavorate).reduce(
    (acc, ore) => acc + ore,
    0,
  );
  const totaleStipendio = totaleOre * pagaOraria;

  const handleDelete = async (date) => {
    setOreLavorate((prev) => {
      const newState = { ...prev };
      delete newState[date];
      return newState;
    });
    await deleteOreLavorate(date);
    setDeleteDate(null);
  };

  const handleDeleteAll = async () => {
    setOreLavorate({});
    await deleteAllOreLavorate();
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Paga oraria (€)"
                type="number"
                value={pagaOraria}
                onChange={(e) => setPagaOraria(parseFloat(e.target.value) || 0)}
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.7)" }}
              />
              <TextField
                fullWidth
                label="Ore lavorate (HH.mm)"
                type="text"
                value={oreOggi}
                onChange={(e) => setOreOggi(e.target.value)}
                placeholder="08.30"
                error={!!error}
                helperText={error}
                sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
              />
              <Button
                variant="contained"
                onClick={salvaOreOggi}
                sx={{
                  mt: 2,
                  background: "linear-gradient(135deg,rgb(211, 85, 0),rgb(195, 78, 0))",
                  "&:hover": {
                    background: "linear-gradient(135deg, #816205ff, #6a4f04ff)",
                  },
                  color: "#fff",
                }}
                fullWidth
              >
                Salva ore
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={3}
          sx={{ p: 4, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.secondary.main }}
            >
              Riepilogo del mese
            </Typography>
            <IconButton
              onClick={() => setShowDeleteAllDialog(true)}
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      width: "40%",
                    }}
                  >
                    Data
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      width: "60%",
                    }}
                  >
                    Ore
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(oreLavorate)
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .map(([data, ore]) => (
                    <TableRow key={data}>
                      <TableCell sx={{ width: "40%" }}>
                        {format(new Date(data), "dd/MM/yy", { locale: it })}
                      </TableCell>
                      <TableCell align="right" sx={{ width: "60%" }}>
                        {formatTimeFromHours(ore)}
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(data)}
                          sx={{ ml: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteDate(data)}
                          sx={{
                            color: theme.palette.error.main,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper
          elevation={3}
          sx={{ p: 4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.secondary.main }}
          >
            Totali
          </Typography>
          <Typography
            sx={{ color: theme.palette.primary.main, fontSize: "1.1rem" }}
          >
            Ore totali: {formatTimeFromHours(totaleOre)}
          </Typography>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Stipendio previsto: €{totaleStipendio.toFixed(2)}
          </Typography>
        </Paper>

        <Dialog
          open={!!editingDate}
          onClose={() => setEditingDate(null)}
          PaperProps={{
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <DialogTitle sx={{ color: theme.palette.primary.main }}>
            Modifica ore lavorate
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Ore lavorate (HH.mm)"
              type="text"
              fullWidth
              value={editingHours}
              onChange={(e) => setEditingHours(e.target.value)}
              placeholder="08.30"
              error={!!error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingDate(null)}>Annulla</Button>
            <Button onClick={handleSaveEdit} variant="contained">
              Salva
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog open={!!deleteDate} onClose={() => setDeleteDate(null)}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare questo giorno lavorativo?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDate(null)}>Annulla</Button>
          <Button
            onClick={() => handleDelete(deleteDate)}
            color="error"
            variant="contained"
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
      >
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare tutti i giorni lavorativi? Questa
            azione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteAllDialog(false)}>Annulla</Button>
          <Button onClick={handleDeleteAll} color="error" variant="contained">
            Elimina tutto
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default CalcolatoreStipendio;
