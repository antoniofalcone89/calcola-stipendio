import { useState, useEffect } from "react";
import { loadPagaOraria, savePagaOraria } from "../db/database";

/**
 * Custom hook for managing hourly rate (paga oraria)
 * Handles loading, saving, and state management
 */
export const usePagaOraria = () => {
  const [pagaOraria, setPagaOraria] = useState(() => {
    const stored = localStorage.getItem("pagaOraria");
    const val = stored !== null ? parseFloat(stored) : NaN;
    return Number.isFinite(val) ? val : 10;
  });

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const savedPagaOraria = await loadPagaOraria();
      setPagaOraria(savedPagaOraria);
    };

    loadData();
  }, []);

  // Save pagaOraria when it changes
  useEffect(() => {
    savePagaOraria(pagaOraria);
  }, [pagaOraria]);

  return [pagaOraria, setPagaOraria];
};
