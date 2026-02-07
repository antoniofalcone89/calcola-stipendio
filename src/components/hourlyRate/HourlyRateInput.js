import { memo } from "react";
import { TextField } from "../ui/forms";
import { Grid } from "../ui/layout";
import { IconButton } from "../ui/buttons";
import SaveIcon from "@mui/icons-material/Save";
import "./assets/hourlyRateInput.css";

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
        className="paga-oraria-input-container"
      >
        <IconButton
          onClick={onSave}
          disabled={disabled}
          className="btn-icon"
          size="small"
        >
          <SaveIcon />
        </IconButton>
      </TextField>
    </Grid>
  );
};

export default memo(HourlyRateInput, (prevProps, nextProps) => {
  return (
    prevProps.pagaOraria === nextProps.pagaOraria &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.onPagaOrariaChange === nextProps.onPagaOrariaChange &&
    prevProps.onSave === nextProps.onSave
  );
});
