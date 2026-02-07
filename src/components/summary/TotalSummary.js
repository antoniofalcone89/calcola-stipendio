import { memo } from "react";
import { Typography } from "../ui/data-display";
import { formatTimeFromHours } from "../../utils/timeUtils";

/**
 * Component for displaying total hours and expected salary
 * Single Responsibility: Display totals calculation
 */
const TotalSummary = ({ totaleOre, totaleStipendio }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom className="text-secondary">
        Totali
      </Typography>
      <Typography className="text-primary text-lg">
        Ore totali: {formatTimeFromHours(totaleOre)}
      </Typography>
      <Typography className="text-primary text-lg font-bold">
        Stipendio previsto: €{totaleStipendio.toFixed(2)}
      </Typography>
    </>
  );
};

export default memo(TotalSummary, (prevProps, nextProps) => {
  // Custom comparison to detect changes
  return (
    prevProps.totaleOre === nextProps.totaleOre &&
    prevProps.totaleStipendio === nextProps.totaleStipendio
  );
});
