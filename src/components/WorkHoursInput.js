import { TextField, Button, Grid } from "@mui/material";

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
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.7)" }}
      />
      <TextField
        fullWidth
        label="Ore lavorate (HH.mm)"
        type="text"
        value={oreOggi}
        onChange={(e) => onHoursChange(e.target.value)}
        placeholder="08.30"
        error={!!error}
        helperText={error}
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
      />
      <Button
        variant="contained"
        onClick={onSave}
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
  );
};

export default WorkHoursInput;
