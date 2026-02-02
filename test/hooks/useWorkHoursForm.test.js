import { renderHook, act } from '@testing-library/react';
import { useWorkHoursForm, useEditDialog } from '../../src/hooks/useWorkHoursForm';
import { format } from 'date-fns';

jest.mock('../../src/utils/validationUtils', () => ({
  isValidTimeFormat: jest.fn(),
}));

jest.mock('../../src/utils/timeUtils', () => ({
  convertTimeToHours: jest.fn(),
  formatTimeFromHours: jest.fn(),
}));

import { isValidTimeFormat } from '../../src/utils/validationUtils';
import { convertTimeToHours, formatTimeFromHours } from '../../src/utils/timeUtils';

describe('useWorkHoursForm', () => {
  const mockOnSaveHours = jest.fn().mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
    isValidTimeFormat.mockReturnValue(true);
    convertTimeToHours.mockReturnValue(8.5);
    formatTimeFromHours.mockReturnValue('08.30');
  });

  it('should initialize with current date', () => {
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));
    const today = format(new Date(), 'yyyy-MM-dd');

    expect(result.current.selectedDate).toBe(today);
  });

  it('should initialize with empty oreOggi and error', () => {
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));

    expect(result.current.oreOggi).toBe('');
    expect(result.current.error).toBe('');
  });

  it('should update selectedDate', () => {
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));

    act(() => {
      result.current.setSelectedDate('2024-01-15');
    });

    expect(result.current.selectedDate).toBe('2024-01-15');
  });

  it('should update oreOggi', () => {
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));

    act(() => {
      result.current.setOreOggi('08.30');
    });

    expect(result.current.oreOggi).toBe('08.30');
  });

  it('should show error when oreOggi is empty', async () => {
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.error).toBe('Inserisci le ore lavorate');
    expect(mockOnSaveHours).not.toHaveBeenCalled();
  });

  it('should show error when time format is invalid', async () => {
    isValidTimeFormat.mockReturnValue(false);
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));

    act(() => {
      result.current.setOreOggi('invalid');
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.error).toBe("Formato ore non valido. Usa HH.mm oppure H (es: 08.30 oppure 8)");
    expect(mockOnSaveHours).not.toHaveBeenCalled();
  });

  it('should save hours when valid', async () => {
    const { result } = renderHook(() => useWorkHoursForm(mockOnSaveHours));

    act(() => {
      result.current.setOreOggi('08.30');
      result.current.setSelectedDate('2024-01-15');
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockOnSaveHours).toHaveBeenCalledWith('2024-01-15', 8.5);
    expect(result.current.oreOggi).toBe('');
    expect(result.current.error).toBe('');
  });
});

describe('useEditDialog', () => {
  const mockOreLavorate = {
    '2024-01-15': 8.5,
    '2024-01-16': 7.5,
  };
  const mockOnSaveHours = jest.fn().mockResolvedValue();

  beforeEach(() => {
    jest.clearAllMocks();
    isValidTimeFormat.mockReturnValue(true);
    convertTimeToHours.mockReturnValue(8.5);
    formatTimeFromHours.mockReturnValue('08.30');
  });

  it('should initialize with null editingDate', () => {
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    expect(result.current.editingDate).toBe(null);
    expect(result.current.editingHours).toBe('');
    expect(result.current.error).toBe('');
  });

  it('should open edit dialog with correct values', () => {
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    act(() => {
      result.current.handleEdit('2024-01-15');
    });

    expect(result.current.editingDate).toBe('2024-01-15');
    expect(formatTimeFromHours).toHaveBeenCalledWith(8.5);
    expect(result.current.editingHours).toBe('08.30');
    expect(result.current.error).toBe('');
  });

  it('should update editingHours', () => {
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    act(() => {
      result.current.setEditingHours('09.00');
    });

    expect(result.current.editingHours).toBe('09.00');
  });

  it('should show error when editingHours is empty', async () => {
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    act(() => {
      result.current.handleEdit('2024-01-15');
      result.current.setEditingHours('');
    });

    await act(async () => {
      await result.current.handleSaveEdit();
    });

    expect(result.current.error).toBe('Inserisci le ore lavorate');
    expect(mockOnSaveHours).not.toHaveBeenCalled();
  });

  it('should show error when time format is invalid', async () => {
    isValidTimeFormat.mockReturnValue(false);
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    act(() => {
      result.current.handleEdit('2024-01-15');
      result.current.setEditingHours('invalid');
    });

    await act(async () => {
      await result.current.handleSaveEdit();
    });

    expect(result.current.error).toBe('Formato ore non valido. Usa HH.mm oppure H (es: 08.30 oppure 8)');
    expect(mockOnSaveHours).not.toHaveBeenCalled();
  });

  it('should save edited hours when valid', async () => {
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    act(() => {
      result.current.handleEdit('2024-01-15');
      result.current.setEditingHours('09.00');
    });

    await act(async () => {
      await result.current.handleSaveEdit();
    });

    expect(mockOnSaveHours).toHaveBeenCalledWith('2024-01-15', 8.5);
    expect(result.current.editingDate).toBe(null);
    expect(result.current.editingHours).toBe('');
    expect(result.current.error).toBe('');
  });

  it('should close dialog and reset state', () => {
    const { result } = renderHook(() => useEditDialog(mockOreLavorate, mockOnSaveHours));

    act(() => {
      result.current.handleEdit('2024-01-15');
      result.current.setEditingHours('09.00');
      result.current.handleClose();
    });

    expect(result.current.editingDate).toBe(null);
    expect(result.current.editingHours).toBe('');
    expect(result.current.error).toBe('');
  });
});
