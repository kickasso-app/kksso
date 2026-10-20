// Event dates accepted by the open call form (YYYY-MM-DD, both days included).
export const OPENCALL_DATES = {
  start: "2026-11-15",
  end: "2026-12-15",
};

export const isWithinOpenCallDates = (date) =>
  date >= OPENCALL_DATES.start && date <= OPENCALL_DATES.end;
