import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, DeleteSweep as DeleteSweepIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { formatTimeFromHours } from "../utils/timeUtils";
import { theme } from "../theme/theme";

/**
 * Component for displaying the summary table of worked hours
 * Single Responsibility: Display and manage the list of worked hours
 */
const SummaryTable = ({
  oreLavorate,
  onEdit,
  onDelete,
  onDeleteAll,
}) => {
  return (
    <Box>
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
          onClick={onDeleteAll}
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
                      onClick={() => onEdit(data)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(data)}
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
    </Box>
  );
};

export default SummaryTable;
