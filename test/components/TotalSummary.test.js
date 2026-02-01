import { render, screen } from '@testing-library/react';
import TotalSummary from '../../src/components/TotalSummary';

jest.mock('../../src/utils/timeUtils', () => ({
  formatTimeFromHours: jest.fn((hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}`;
  }),
}));

describe('TotalSummary', () => {
  it('should render totali heading', () => {
    render(<TotalSummary totaleOre={40} totaleStipendio={400} />);

    expect(screen.getByText('Totali')).toBeInTheDocument();
  });

  it('should display total hours correctly', () => {
    render(<TotalSummary totaleOre={40.5} totaleStipendio={405} />);

    expect(screen.getByText(/ore totali: 40\.30/i)).toBeInTheDocument();
  });

  it('should display expected salary correctly', () => {
    render(<TotalSummary totaleOre={40} totaleStipendio={400.50} />);

    expect(screen.getByText(/stipendio previsto: €400\.50/i)).toBeInTheDocument();
  });

  it('should format salary with 2 decimal places', () => {
    render(<TotalSummary totaleOre={40} totaleStipendio={400.5} />);

    expect(screen.getByText(/€400\.50/i)).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    render(<TotalSummary totaleOre={0} totaleStipendio={0} />);

    expect(screen.getByText(/ore totali: 00\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/€0\.00/i)).toBeInTheDocument();
  });

  it('should handle large values', () => {
    render(<TotalSummary totaleOre={200} totaleStipendio={2000} />);

    expect(screen.getByText(/ore totali: 200\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/€2000\.00/i)).toBeInTheDocument();
  });
});
