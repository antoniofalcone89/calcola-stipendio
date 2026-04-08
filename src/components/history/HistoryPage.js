import { useState } from "react";
import MonthList from "./MonthList";
import MonthDetail from "./MonthDetail";

const HistoryPage = ({
  oreLavorate,
  saveHours,
  removeHours,
  pagaOraria,
  loading,
  onNavigate,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  if (selectedMonth) {
    return (
      <MonthDetail
        month={selectedMonth}
        oreLavorate={oreLavorate}
        saveHours={saveHours}
        removeHours={removeHours}
        pagaOraria={pagaOraria}
        onBack={() => setSelectedMonth(null)}
      />
    );
  }

  return (
    <MonthList
      oreLavorate={oreLavorate}
      pagaOraria={pagaOraria}
      loading={loading}
      onSelectMonth={setSelectedMonth}
      onNavigateHome={() => onNavigate("calculator")}
    />
  );
};

export default HistoryPage;
