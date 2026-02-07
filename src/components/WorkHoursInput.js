import { memo } from "react";
import { TextField } from "./ui/forms";
import { Button } from "./ui/buttons";
import { Grid } from "./ui/layout";

/**
 * Component for inputting work hours for a specific date
 * Single Responsibility: Handle work hours input and submission
 */
const WorkHoursInput = ({
  selectedDate,
  onDateChange,
  oreOggi,
  onHoursChange,
  error,
  onSave,
}) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Data"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="input-field"
      />
      <TextField
        fullWidth
        label="Ore lavorate"
        type="number"
        value={oreOggi}
        onChange={(e) => onHoursChange(e.target.value)}
        placeholder="08.30"
        error={!!error}
        helperText={error}
        className="input-field"
        inputMode="number"
        pattern="[0-9]*"
      />
      <Button
        variant="contained"
        onClick={onSave}
        className="button-primary"
        fullWidth
      >
        Salva ore
      </Button>
    </Grid>
  );
};

export default memo(WorkHoursInput, (prevProps, nextProps) => {
  return (
    prevProps.selectedDate === nextProps.selectedDate &&
    prevProps.oreOggi === nextProps.oreOggi &&
    prevProps.error === nextProps.error &&
    prevProps.onDateChange === nextProps.onDateChange &&
    prevProps.onHoursChange === nextProps.onHoursChange &&
    prevProps.onSave === nextProps.onSave
  );
});
