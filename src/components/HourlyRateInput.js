import { TextField, Grid, InputAdornment, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

/**
 * Component for inputting hourly rate
 * Single Responsibility: Handle hourly rate input
 */
const HourlyRateInput = ({
  pagaOraria,
  onPagaOrariaChange,
  onSave,
  disabled,
}) => {
  const handleChange = (e) => {
    const value = e.target.value;
    onPagaOrariaChange(value === "" ? null : parseFloat(value));
  };

  return (
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Paga oraria (€/h)"
        id="paga-oraria"
        type="number"
        value={pagaOraria ?? ""}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onSave} disabled={disabled}>
                <SaveIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
      />
    </Grid>
  );
};

export default HourlyRateInput;
