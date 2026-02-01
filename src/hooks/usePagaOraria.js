import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loadPagaOraria, savePagaOraria } from "../db/local-storage-manager";
import { loadPagaOrariaFS, savePagaOrariaFS } from "../db/firestore";

/**
 * Custom hook for managing hourly rate (paga oraria)
 * Handles loading, saving, and state management
 */
export const usePagaOraria = () => {
  const { currentUser } = useAuth();
  const [pagaOraria, setPagaOraria] = useState(() => {
    // Only use localStorage fallback if no user is logged in (or as temporary default)
    const stored = localStorage.getItem("pagaOraria");
    const val = stored !== null ? parseFloat(stored) : NaN;
    return Number.isFinite(val) ? val : 10;
  });
  const [loaded, setLoaded] = useState(false);

  // Load data when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          const savedPagaOraria = await loadPagaOrariaFS(currentUser.uid);
          setPagaOraria(savedPagaOraria);
        } catch (error) {
          console.error("Error loading pagaOraria from Firestore:", error);
        }
      } else {
        const savedPagaOraria = await loadPagaOraria();
        setPagaOraria(savedPagaOraria);
      }
      setLoaded(true);
    };

    loadData();
  }, [currentUser]);

  // Save pagaOraria when it changes
  useEffect(() => {
    if (!loaded) return;

    const saveData = async () => {
      if (currentUser) {
        await savePagaOrariaFS(currentUser.uid, pagaOraria);
      } else {
        await savePagaOraria(pagaOraria);
      }
    };
    
    saveData();
  }, [pagaOraria, currentUser, loaded]);

  return [pagaOraria, setPagaOraria];
};
