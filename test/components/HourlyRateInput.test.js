import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HourlyRateInput from '../../src/components/HourlyRateInput';

describe('HourlyRateInput', () => {
  const mockOnPagaOrariaChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with correct label', () => {
    render(<HourlyRateInput pagaOraria={10} onPagaOrariaChange={mockOnPagaOrariaChange} />);
    
    expect(screen.getByLabelText('Paga oraria (€)')).toBeInTheDocument();
  });

  it('should display the current pagaOraria value', () => {
    render(<HourlyRateInput pagaOraria={15.5} onPagaOrariaChange={mockOnPagaOrariaChange} />);
    
    const input = screen.getByLabelText('Paga oraria (€)');
    expect(input).toHaveValue(15.5);
  });

  it('should call onPagaOrariaChange when value changes', async () => {
    render(<HourlyRateInput pagaOraria={10} onPagaOrariaChange={mockOnPagaOrariaChange} />);
    
    const input = screen.getByLabelText('Paga oraria (€)');
    await userEvent.clear(input);
    await userEvent.type(input, '20');

    expect(mockOnPagaOrariaChange).toHaveBeenCalled();
  });

  it('should handle zero value', async () => {
    render(<HourlyRateInput pagaOraria={10} onPagaOrariaChange={mockOnPagaOrariaChange} />);
    
    const input = screen.getByLabelText('Paga oraria (€)');
    await userEvent.clear(input);
    await userEvent.type(input, '0');

    expect(mockOnPagaOrariaChange).toHaveBeenCalled();
  });
});
