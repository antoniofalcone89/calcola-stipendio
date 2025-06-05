import Dexie from 'dexie';

// Initialize the database
const db = new Dexie('stipendioDb');
db.version(1).stores({
  oreLavorateStore: 'date,hours',
  settings: 'id,pagaOraria'
});

// Database operations
export const saveOreLavorate = async (date, hours) => {
  await db.oreLavorateStore.put({ date, hours });
};

export const loadOreLavorate = async () => {
  const savedOre = await db.oreLavorateStore.toArray();
  return savedOre.reduce((acc, { date, hours }) => {
    acc[date] = hours;
    return acc;
  }, {});
};

export const savePagaOraria = async (pagaOraria) => {
  await db.settings.put({ id: 1, pagaOraria });
};

export const loadPagaOraria = async () => {
  const settings = await db.settings.get(1);
  return settings?.pagaOraria || 10;
};

export const deleteOreLavorate = async (date) => {
  await db.oreLavorateStore.delete(date);
};

export const deleteAllOreLavorate = async () => {
  await db.oreLavorateStore.clear();
};