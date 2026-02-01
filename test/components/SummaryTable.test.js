import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryTable from '../../src/components/SummaryTable';

jest.mock('../../src/utils/timeUtils', () => ({
  formatTimeFromHours: jest.fn((hours) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}`;
  }),
}));

describe('SummaryTable', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnDeleteAll = jest.fn();

  const mockOreLavorate = {
    '2024-01-15': 8.5,
    '2024-01-16': 7.5,
    '2024-01-17': 8.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table with correct headers', () => {
    render(
      <SummaryTable
        oreLavorate={mockOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Ore')).toBeInTheDocument();
  });

  it('should render all worked hours entries', () => {
    render(
      <SummaryTable
        oreLavorate={mockOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    expect(screen.getByText('15/01/24')).toBeInTheDocument();
    expect(screen.getByText('16/01/24')).toBeInTheDocument();
    expect(screen.getByText('17/01/24')).toBeInTheDocument();
  });

  it('should display formatted hours for each entry', () => {
    render(
      <SummaryTable
        oreLavorate={mockOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    expect(screen.getByText('08.30')).toBeInTheDocument();
    expect(screen.getByText('07.30')).toBeInTheDocument();
    expect(screen.getByText('08.00')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    render(
      <SummaryTable
        oreLavorate={mockOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    // Find edit button by finding the row with the date and clicking the first button in that row's cell
    const dateCell = screen.getByText('15/01/24');
    const row = dateCell.closest('tr');
    const buttons = row.querySelectorAll('button');
    // First button is edit, second is delete
    await userEvent.click(buttons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith('2024-01-15');
  });

  it('should call onDelete when delete button is clicked', async () => {
    render(
      <SummaryTable
        oreLavorate={mockOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    // Find delete button by finding the row with the date and clicking the second button
    const dateCell = screen.getByText('15/01/24');
    const row = dateCell.closest('tr');
    const buttons = row.querySelectorAll('button');
    // Second button is delete
    await userEvent.click(buttons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith('2024-01-15');
  });

  it('should call onDeleteAll when delete all button is clicked', async () => {
    render(
      <SummaryTable
        oreLavorate={mockOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    // Find delete all button - it's the button outside the table (in the header)
    const allButtons = screen.getAllByRole('button');
    // The delete all button is the one not inside a table row with data
    const deleteAllButton = Array.from(allButtons).find(btn => {
      const row = btn.closest('tr');
      return !row || row.querySelector('th'); // Header row or no row
    });
    await userEvent.click(deleteAllButton);

    expect(mockOnDeleteAll).toHaveBeenCalled();
  });

  it('should render empty state when no entries', () => {
    render(
      <SummaryTable
        oreLavorate={{}}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    expect(screen.getByText('Riepilogo del mese')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('should sort entries by date', () => {
    const unsortedOreLavorate = {
      '2024-01-17': 8.0,
      '2024-01-15': 8.5,
      '2024-01-16': 7.5,
    };

    render(
      <SummaryTable
        oreLavorate={unsortedOreLavorate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    const rows = screen.getAllByRole('row');
    // First row is header, so check data rows
    expect(rows[1]).toHaveTextContent('15/01/24');
    expect(rows[2]).toHaveTextContent('16/01/24');
    expect(rows[3]).toHaveTextContent('17/01/24');
  });
});
