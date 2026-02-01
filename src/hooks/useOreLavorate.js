import { useState, useEffect } from "react";
import { loadOreLavorate, saveOreLavorate, deleteOreLavorate, deleteAllOreLavorate } from "../db/database";

/**
 * Custom hook for managing worked hours (ore lavorate)
 * Handles loading, saving, deleting, and state management
 */
export const useOreLavorate = () => {
  const [oreLavorate, setOreLavorate] = useState({});

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      const savedOre = await loadOreLavorate();
      setOreLavorate(savedOre);
    };

    loadData();
  }, []);

  const saveHours = async (date, hours) => {
    setOreLavorate((prev) => ({
      ...prev,
      [date]: hours,
    }));
    await saveOreLavorate(date, hours);
  };

  const removeHours = async (date) => {
    setOreLavorate((prev) => {
      const newState = { ...prev };
      delete newState[date];
      return newState;
    });
    await deleteOreLavorate(date);
  };

  const removeAllHours = async () => {
    setOreLavorate({});
    await deleteAllOreLavorate();
  };

  return {
    oreLavorate,
    saveHours,
    removeHours,
    removeAllHours,
  };
};
