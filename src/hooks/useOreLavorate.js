import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loadOreLavorate, saveOreLavorate, deleteOreLavorate, deleteAllOreLavorate } from "../db/local-storage-manager";
import { 
  loadOreLavorateFS, 
  saveOreLavorateFS, 
  deleteOreLavorateFS, 
  deleteAllOreLavorateFS 
} from "../db/firestore";

/**
 * Custom hook for managing worked hours (ore lavorate)
 * Handles loading, saving, deleting, and state management
 */
export const useOreLavorate = () => {
  const { currentUser } = useAuth();
  const [oreLavorate, setOreLavorate] = useState({});

  // Load data when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          const savedOre = await loadOreLavorateFS(currentUser.uid);
          setOreLavorate(savedOre);
        } catch (error) {
          console.error("Error loading data from Firestore:", error);
        }
      } else {
        const savedOre = await loadOreLavorate();
        setOreLavorate(savedOre);
      }
    };

    loadData();
  }, [currentUser]);

  const saveHours = async (date, hours) => {
    setOreLavorate((prev) => ({
      ...prev,
      [date]: hours,
    }));
    
    if (currentUser) {
      await saveOreLavorateFS(currentUser.uid, date, hours);
    } else {
      await saveOreLavorate(date, hours);
    }
  };

  const removeHours = async (date) => {
    setOreLavorate((prev) => {
      const newState = { ...prev };
      delete newState[date];
      return newState;
    });
    
    if (currentUser) {
      await deleteOreLavorateFS(currentUser.uid, date);
    } else {
      await deleteOreLavorate(date);
    }
  };

  const removeAllHours = async () => {
    setOreLavorate({});
    
    if (currentUser) {
      await deleteAllOreLavorateFS(currentUser.uid);
    } else {
      await deleteAllOreLavorate();
    }
  };

  return {
    oreLavorate,
    saveHours,
    removeHours,
    removeAllHours,
  };
};
