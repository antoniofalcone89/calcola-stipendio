import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

/**
 * Dialog component for confirming deletion of all entries
 * Single Responsibility: Handle confirmation for deleting all entries
 */
const DeleteAllDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Conferma eliminazione</DialogTitle>
      <DialogContent>
        <Typography>
          Sei sicuro di voler eliminare tutti i giorni lavorativi? Questa
          azione non può essere annullata.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Elimina tutto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAllDialog;
