import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteAllDialog from '../../src/components/DeleteAllDialog';

describe('DeleteAllDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <DeleteAllDialog
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByText('Conferma eliminazione')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <DeleteAllDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Conferma eliminazione')).toBeInTheDocument();
  });

  it('should display confirmation message for deleting all', () => {
    render(
      <DeleteAllDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(
      screen.getByText(/sei sicuro di voler eliminare tutti i giorni lavorativi/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/questa azione non può essere annullata/i)
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(
      <DeleteAllDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annulla/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onConfirm when delete all button is clicked', async () => {
    render(
      <DeleteAllDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteAllButton = screen.getByRole('button', { name: /elimina tutto/i });
    await userEvent.click(deleteAllButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
