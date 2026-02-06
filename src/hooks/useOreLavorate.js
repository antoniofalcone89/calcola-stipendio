import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
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
  const { currentUser, loading: authLoading } = useAuth();
  const [oreLavorate, setOreLavorate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (currentUser) {
        try {
          const savedOre = await loadOreLavorateFS(currentUser.uid);
          setOreLavorate(savedOre);
        } catch (error) {
          console.error("Error loading data from Firestore:", error);
          setOreLavorate(null);
        }
      } else {
        setOreLavorate(null);
      }

      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [currentUser, authLoading]);

  const saveHours = (date, hours) => {
    setOreLavorate((prev) => ({ ...(prev || {}), [date]: hours }));

    if (currentUser) {
      saveOreLavorateFS(currentUser.uid, date, hours).catch((error) => {
        console.error("Error saving hours to Firestore:", error);
      });
    }
  };

  const removeHours = (date) => {
    setOreLavorate((prev) => {
      const newData = { ...(prev || {}) };
      delete newData[date];
      return newData;
    });

    if (currentUser) {
      deleteOreLavorateFS(currentUser.uid, date).catch((error) => {
        console.error("Error deleting hours from Firestore:", error);
      });
    }
  };

  const removeAllHours = () => {
    setOreLavorate({});

    if (currentUser) {
      deleteAllOreLavorateFS(currentUser.uid).catch((error) => {
        console.error("Error deleting all hours from Firestore:", error);
      });
    }
  };

  return {
    oreLavorate,
    saveHours,
    removeHours,
    removeAllHours,
    loading,
  };
};
