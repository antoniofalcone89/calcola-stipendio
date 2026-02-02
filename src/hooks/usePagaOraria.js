import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loadPagaOrariaFS, savePagaOrariaFS } from "../db/firestore";

/**
 * Custom hook for managing hourly rate (paga oraria)
 * Handles loading, saving, and state management
 */
export const usePagaOraria = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [pagaOraria, setPagaOrariaState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const loadedValueRef = useRef(null);

  // Load data when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      if (currentUser) {
        try {
          const savedPagaOraria = await loadPagaOrariaFS(currentUser.uid);
          setPagaOrariaState(savedPagaOraria ?? null);
          loadedValueRef.current = savedPagaOraria ?? null;
        } catch (error) {
          console.error("Error loading pagaOraria from Firestore:", error);
          setPagaOrariaState(null);
          loadedValueRef.current = null;
        }
      } else {
        setPagaOrariaState(null);
        loadedValueRef.current = null;
      }

      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [currentUser, authLoading]);

  const setPagaOraria = (value) => {
    setPagaOrariaState(value);
    setHasChanged(value !== loadedValueRef.current);
  };

  const savePagaOraria = async () => {
    if (pagaOraria !== null) {
      try {
        await savePagaOrariaFS(currentUser.uid, pagaOraria);
        loadedValueRef.current = pagaOraria;
        setHasChanged(false);
      } catch (error) {
        console.error("Error saving pagaOraria to Firestore:", error);
      }
    }
  };

  return { pagaOraria, setPagaOraria, savePagaOraria, loading, hasChanged };
};
