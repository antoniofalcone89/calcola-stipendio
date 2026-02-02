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
      await saveOreLavorateFS(currentUser.uid, date, hours);
      // Update the ref to include the new value
      loadedValueRef.current = {
        ...(loadedValueRef.current || {}),
        [date]: hours,
      };
    }
  };

  const removeHours = async (date) => {
    const currentData = oreLavorate || {};
    const newData = { ...currentData };
    delete newData[date];
    setOreLavorate(newData);
    
    if (currentUser && loadedValueRef.current !== null) {
      await deleteOreLavorateFS(currentUser.uid, date);
      // Update the ref to remove the value
      const newRef = { ...(loadedValueRef.current || {}) };
      delete newRef[date];
      loadedValueRef.current = newRef;
    }
  };

  const removeAllHours = async () => {
    setOreLavorate({});
    
    if (currentUser && loadedValueRef.current !== null) {
      await deleteAllOreLavorateFS(currentUser.uid);
      loadedValueRef.current = {};
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
