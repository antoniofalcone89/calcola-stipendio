import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "../ui/data-display";
import { memo } from "react";
import { IconButton } from "../ui/buttons";
import { Box } from "../ui/layout";
import { Typography } from "../ui/data-display";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { formatTimeFromHours } from "../../utils/timeUtils";
import "./assets/summary.css";

/**
 * Component for displaying the summary table of worked hours
 * Single Responsibility: Display and manage the list of worked hours
 */
const SummaryTable = ({ oreLavorate, onEdit, onDelete, onDeleteAll }) => {
  return (
    <Box>
      <Box className="flex flex-between flex-center mb-2">
        <Typography variant="h6" className="text-secondary riepilogo-title">
          Riepilogo del mese
        </Typography>
        <IconButton
          onClick={onDeleteAll}
          className="button-icon text-error"
          size="small"
        >
          <DeleteSweepIcon />
        </IconButton>
      </Box>
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
            {(oreLavorate && typeof oreLavorate === "object"
              ? Object.entries(oreLavorate)
              : []
            )
              .sort(([a], [b]) => new Date(a) - new Date(b))
              .map(([data, ore]) => (
                <TableRow key={data}>
                  <TableCell style={{ width: "40%" }}>
                    {format(new Date(data), "dd/MM/yy", { locale: it })}
                  </TableCell>
                  <TableCell align="right" style={{ width: "60%" }}>
                    {formatTimeFromHours(ore)}
                    <IconButton
                      size="small"
                      onClick={() => onEdit(data)}
                      className="button-icon"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(data)}
                      className="button-icon text-error"
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

export default memo(SummaryTable, (prevProps, nextProps) => {
  // Deep comparison of oreLavorate objects
  const areEqual =
    JSON.stringify(prevProps.oreLavorate) ===
      JSON.stringify(nextProps.oreLavorate) &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onDeleteAll === nextProps.onDeleteAll;
  return areEqual;
});
