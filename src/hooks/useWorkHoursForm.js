import { useState } from "react";
import { format } from "date-fns";
import { isValidTimeFormat } from "../utils/validationUtils";
import { convertTimeToHours, formatTimeFromHours } from "../utils/timeUtils";

/**
 * Custom hook for managing work hours form state and validation
 * Single Responsibility: Handle form state and validation logic
 */
export const useWorkHoursForm = (onSaveHours) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [oreOggi, setOreOggi] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!oreOggi) {
      setError("Inserisci le ore lavorate");
      return;
    }

    if (!isValidTimeFormat(oreOggi)) {
      setError("Formato ore non valido. Usa HH.mm (es: 08.30)");
      return;
    }

    const hours = convertTimeToHours(oreOggi);
    if (!isNaN(hours)) {
      await onSaveHours(selectedDate, hours);
      setOreOggi("");
      setError("");
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    oreOggi,
    setOreOggi,
    error,
    handleSave,
  };
};

/**
 * Custom hook for managing edit dialog state and validation
 * Single Responsibility: Handle edit dialog state and validation logic
 */
export const useEditDialog = (oreLavorate, onSaveHours) => {
  const [editingDate, setEditingDate] = useState(null);
  const [editingHours, setEditingHours] = useState("");
  const [error, setError] = useState("");

  const handleEdit = (date) => {
    setEditingDate(date);
    setEditingHours(formatTimeFromHours(oreLavorate[date]));
    setError("");
  };

  const handleSaveEdit = async () => {
    if (!editingHours) {
      setError("Inserisci le ore lavorate");
      return;
    }

    if (!isValidTimeFormat(editingHours)) {
      setError("Formato ore non valido. Usa HH.mm (es: 08.30)");
      return;
    }

    const hours = convertTimeToHours(editingHours);
    if (!isNaN(hours)) {
      await onSaveHours(editingDate, hours);
      setEditingDate(null);
      setEditingHours("");
      setError("");
    }
  };

  const handleClose = () => {
    setEditingDate(null);
    setEditingHours("");
    setError("");
  };

  return {
    editingDate,
    editingHours,
    setEditingHours,
    error,
    handleEdit,
    handleSaveEdit,
    handleClose,
  };
};
