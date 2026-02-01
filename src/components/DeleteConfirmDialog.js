import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

/**
 * Dialog component for confirming deletion of a single day
 * Single Responsibility: Handle confirmation for deleting a single entry
 */
const DeleteConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Conferma eliminazione</DialogTitle>
      <DialogContent>
        <Typography>
          Sei sicuro di voler eliminare questo giorno lavorativo?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Elimina
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
