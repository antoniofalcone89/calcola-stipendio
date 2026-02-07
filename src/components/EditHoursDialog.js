import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "./ui/surfaces";
import { memo } from "react";
import { Button } from "./ui/buttons";
import { TextField } from "./ui/forms";

/**
 * Dialog component for editing worked hours
 * Single Responsibility: Handle editing of worked hours
 */
const EditHoursDialog = ({
  open,
  editingHours,
  onHoursChange,
  error,
  onClose,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="dialog-container">
      <DialogTitle className="text-primary">Modifica ore lavorate</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Ore lavorate"
          type="text"
          fullWidth
          value={editingHours}
          onChange={(e) => onHoursChange(e.target.value)}
          placeholder="08.30"
          error={!!error}
          helperText={error}
          className="input-field"
          inputMode="decimal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Annulla
        </Button>
        <Button onClick={onSave} variant="contained">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(EditHoursDialog, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.editingHours === nextProps.editingHours &&
    prevProps.error === nextProps.error &&
    prevProps.onHoursChange === nextProps.onHoursChange &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onSave === nextProps.onSave
  );
});
