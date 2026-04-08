import { useMemo } from "react";
import { format, parseISO } from "date-fns";
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
import { IconButton } from "../ui/buttons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { groupByMonth, formatTimeFromHours } from "../../utils/timeUtils";

const MonthList = ({
  oreLavorate,
  pagaOraria,
  loading,
  onSelectMonth,
  onNavigateHome,
}) => {
  const months = useMemo(() => {
    const grouped = groupByMonth(oreLavorate);
    const currentMonth = format(new Date(), "yyyy-MM");
    return Object.entries(grouped)
      .filter(([month]) => month !== currentMonth)
      .sort(([a], [b]) => b.localeCompare(a));
  }, [oreLavorate]);

  if (loading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="spinner"></div>
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
        <IconButton onClick={onNavigateHome} className="button-icon">
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
          Storico
        </Typography>
        <Box style={{ width: 44 }} />
      </Box>

      <Paper
        elevation="md"
        style={{
          padding: "16px 32px",
          marginBottom: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Typography variant="body2" style={{ color: "#666", fontStyle: "italic" }}>
          Gli importi sono calcolati in base alla tariffa oraria attuale (€
          {pagaOraria}/ora). Variazioni passate della tariffa non vengono
          considerate.
        </Typography>
      </Paper>

      <Paper
        elevation="md"
        style={{
          padding: "32px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {months.length === 0 ? (
          <Typography variant="body1" className="text-primary">
            Nessuno storico disponibile.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold text-primary">Mese</TableCell>
                  <TableCell align="right" className="font-bold text-primary">
                    Ore totali
                  </TableCell>
                  <TableCell align="right" className="font-bold text-primary">
                    Importo stimato
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {months.map(([month, { totalHours }]) => (
                  <TableRow
                    key={month}
                    onClick={() => onSelectMonth(month)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      {format(parseISO(`${month}-01`), "MMMM yyyy", {
                        locale: it,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {formatTimeFromHours(totalHours)}
                    </TableCell>
                    <TableCell align="right">
                      €{(totalHours * (pagaOraria || 0)).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <ChevronRightIcon
                        fontSize="small"
                        style={{ color: "#999", verticalAlign: "middle" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default MonthList;
