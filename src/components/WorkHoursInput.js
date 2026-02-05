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
        type="text"
        value={oreOggi}
        onChange={(e) => onHoursChange(e.target.value)}
        placeholder="08.30"
        error={!!error}
        helperText={error}
        className="input-field"
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

export default WorkHoursInput;
