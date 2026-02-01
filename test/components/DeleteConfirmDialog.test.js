import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmDialog from '../../src/components/DeleteConfirmDialog';

describe('DeleteConfirmDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <DeleteConfirmDialog
        open={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByText('Conferma eliminazione')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Conferma eliminazione')).toBeInTheDocument();
  });

  it('should display confirmation message', () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(
      screen.getByText(/sei sicuro di voler eliminare questo giorno lavorativo/i)
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annulla/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onConfirm when delete button is clicked', async () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /elimina/i });
    await userEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
