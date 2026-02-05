import { db } from "../config/firebase";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";

// Firestore operations

export const saveOreLavorateFS = async (userId, date, hours) => {
  const docRef = doc(db, "users", userId, "oreLavorate", date);
  await setDoc(docRef, { date, hours });
};

export const loadOreLavorateFS = async (userId) => {
  const querySnapshot = await getDocs(
    collection(db, "users", userId, "oreLavorate"),
  );
  const data = {};
  querySnapshot.forEach((doc) => {
    const d = doc.data();
    data[d.date] = d.hours;
  });
  return data;
};

export const deleteOreLavorateFS = async (userId, date) => {
  await deleteDoc(doc(db, "users", userId, "oreLavorate", date));
};

export const deleteAllOreLavorateFS = async (userId) => {
  const querySnapshot = await getDocs(
    collection(db, "users", userId, "oreLavorate"),
  );
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

export const savePagaOrariaFS = async (userId, pagaOraria) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { pagaOraria }, { merge: true });
};

export const loadPagaOrariaFS = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data().pagaOraria ?? 10;
  }
  return 10;
};

export const saveTotalsFS = async (userId, totaleOre, totaleStipendio) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { totaleOre, totaleStipendio }, { merge: true });
};

export const loadTotalsFS = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      totaleOre: Number.isFinite(data.totaleOre) ? data.totaleOre : 0,
      totaleStipendio: Number.isFinite(data.totaleStipendio)
        ? data.totaleStipendio
        : 0,
    };
  }
  return { totaleOre: 0, totaleStipendio: 0 };
};
