import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkHoursInput from '../../src/components/WorkHoursInput';

describe('WorkHoursInput', () => {
  const mockOnDateChange = jest.fn();
  const mockOnHoursChange = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render date input and hours input', () => {
    render(
      <WorkHoursInput
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
        oreOggi="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText(/ore lavorate/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('08.30')).toBeInTheDocument();
  });

  it('should display error message when error is provided', () => {
    render(
      <WorkHoursInput
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
        oreOggi="08.30"
        onHoursChange={mockOnHoursChange}
        error="Invalid format"
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  it('should call onDateChange when date changes', async () => {
    render(
      <WorkHoursInput
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
        oreOggi="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onSave={mockOnSave}
      />
    );

    const dateInput = screen.getByDisplayValue('2024-01-15');
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2024-01-16');

    expect(mockOnDateChange).toHaveBeenCalled();
  });

  it('should call onHoursChange when hours input changes', async () => {
    render(
      <WorkHoursInput
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
        oreOggi="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onSave={mockOnSave}
      />
    );

    const hoursInput = screen.getByLabelText(/ore lavorate/i);
    await userEvent.clear(hoursInput);
    await userEvent.type(hoursInput, '09.00');

    expect(mockOnHoursChange).toHaveBeenCalled();
  });

  it('should call onSave when save button is clicked', async () => {
    render(
      <WorkHoursInput
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
        oreOggi="08.30"
        onHoursChange={mockOnHoursChange}
        error=""
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /salva ore/i });
    await userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should display placeholder text', () => {
    render(
      <WorkHoursInput
        selectedDate="2024-01-15"
        onDateChange={mockOnDateChange}
        oreOggi=""
        onHoursChange={mockOnHoursChange}
        error=""
        onSave={mockOnSave}
      />
    );

    expect(screen.getByPlaceholderText('08.30')).toBeInTheDocument();
  });
});
