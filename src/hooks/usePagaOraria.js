import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loadPagaOrariaFS, savePagaOrariaFS } from "../db/firestore";

/**
 * Custom hook for managing hourly rate (paga oraria)
 * Handles loading, saving, and state management
 */
export const usePagaOraria = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [pagaOraria, setPagaOraria] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadedValueRef = useRef(null);

  // Load data when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (currentUser) {
        try {
          const savedPagaOraria = await loadPagaOrariaFS(currentUser.uid);
          setPagaOraria(savedPagaOraria);
          loadedValueRef.current = savedPagaOraria;
        } catch (error) {
          console.error("Error loading pagaOraria from Firestore:", error);
          setPagaOraria(null);
          loadedValueRef.current = null;
        }
      } else {
        setPagaOraria(null);
        loadedValueRef.current = null;
      }
      
      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [currentUser, authLoading]);

  // Save pagaOraria when it changes
  useEffect(() => {
    if (loading || authLoading || !currentUser || pagaOraria === null) return;

    // Only save if the current value is different from the loaded value
    if (pagaOraria !== loadedValueRef.current) {
      const saveData = async () => {
        try {
          await savePagaOrariaFS(currentUser.uid, pagaOraria);
          loadedValueRef.current = pagaOraria; // Update the ref after successful save
        } catch (error) {
          console.error("Error saving pagaOraria to Firestore:", error);
        }
      };
      
      saveData();
    }
  }, [pagaOraria, currentUser, loading, authLoading]);

  return [pagaOraria, setPagaOraria, loading];
};
