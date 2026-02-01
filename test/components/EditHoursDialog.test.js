import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditHoursDialog from '../../src/components/EditHoursDialog';

describe('EditHoursDialog', () => {
  const mockOnHoursChange = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <EditHoursDialog
        open={false}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Modifica ore lavorate')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Modifica ore lavorate')).toBeInTheDocument();
  });

  it('should display current editing hours', () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('08.30')).toBeInTheDocument();
  });

  it('should call onHoursChange when input changes', async () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Use getByDisplayValue to find the specific input in the dialog
    const input = screen.getByDisplayValue('08.30');
    await userEvent.clear(input);
    await userEvent.type(input, '09.00');

    expect(mockOnHoursChange).toHaveBeenCalled();
  });

  it('should display error message when error is provided', () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error="Invalid format"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /annulla/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onSave when save button is clicked', async () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /salva/i });
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should display placeholder text', () => {
    render(
      <EditHoursDialog
        open={true}
        editingHours=""
        onHoursChange={mockOnHoursChange}
        error=""
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByPlaceholderText('08.30')).toBeInTheDocument();
  });
});
