import { TextField, Grid } from "@mui/material";

/**
 * Component for inputting hourly rate
 * Single Responsibility: Handle hourly rate input
 */
const HourlyRateInput = ({ pagaOraria, onPagaOrariaChange }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Paga oraria (€)"
        type="number"
        value={pagaOraria}
        onChange={(e) => onPagaOrariaChange(parseFloat(e.target.value) || 0)}
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
      />
    </Grid>
  );
};

export default HourlyRateInput;
