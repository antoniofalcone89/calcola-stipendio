import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "./ui/surfaces";
import { memo } from "react";
import { Button } from "./ui/buttons";
import { Typography } from "./ui/data-display";

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
        <Button onClick={onClose} variant="text">
          Annulla
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Elimina
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(DeleteConfirmDialog, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onConfirm === nextProps.onConfirm
  );
});
