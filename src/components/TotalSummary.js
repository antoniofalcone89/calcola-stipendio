import { Typography } from "@mui/material";
import { formatTimeFromHours } from "../utils/timeUtils";
import { theme } from "../theme/theme";

/**
 * Component for displaying total hours and expected salary
 * Single Responsibility: Display totals calculation
 */
const TotalSummary = ({ totaleOre, totaleStipendio }) => {
  return (
    <>
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
    </>
  );
};

export default TotalSummary;
