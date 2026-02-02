import { useState, useEffect, useRef } from "react";
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
  const loadedValueRef = useRef(null);

  // Load data when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (currentUser) {
        try {
          const savedOre = await loadOreLavorateFS(currentUser.uid);
          setOreLavorate(savedOre);
          loadedValueRef.current = savedOre;
        } catch (error) {
          console.error("Error loading data from Firestore:", error);
          setOreLavorate(null);
          loadedValueRef.current = null;
        }
      } else {
        setOreLavorate(null);
        loadedValueRef.current = null;
      }
      
      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [currentUser, authLoading]);

  const saveHours = async (date, hours) => {
    const currentData = oreLavorate || {};
    const newData = { ...currentData, [date]: hours };
    setOreLavorate(newData);
    
    if (currentUser && loadedValueRef.current !== null) {
      try {
        await saveOreLavorateFS(currentUser.uid, date, hours);
        // Update the ref to include the new value
        loadedValueRef.current = {
          ...(loadedValueRef.current || {}),
          [date]: hours,
        };
      } catch (error) {
        console.error("Error saving hours to Firestore:", error);
      }
    }
  };

  const removeHours = async (date) => {
    const currentData = oreLavorate || {};
    const newData = { ...currentData };
    delete newData[date];
    setOreLavorate(newData);
    
    if (currentUser && loadedValueRef.current !== null) {
      try {
        await deleteOreLavorateFS(currentUser.uid, date);
        // Update the ref to remove the value
        const newRef = { ...(loadedValueRef.current || {}) };
        delete newRef[date];
        loadedValueRef.current = newRef;
      } catch (error) {
        console.error("Error deleting hours from Firestore:", error);
      }
    }
  };

  const removeAllHours = async () => {
    setOreLavorate({});
    
    if (currentUser && loadedValueRef.current !== null) {
      try {
        await deleteAllOreLavorateFS(currentUser.uid);
        loadedValueRef.current = {};
      } catch (error) {
        console.error("Error deleting all hours from Firestore:", error);
      }
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
