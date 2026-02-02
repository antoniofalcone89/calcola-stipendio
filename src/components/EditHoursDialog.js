import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { theme } from "../theme/theme";

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
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.primary.main }}>
        Modifica ore lavorate
      </DialogTitle>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={onSave} variant="contained">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHoursDialog;
