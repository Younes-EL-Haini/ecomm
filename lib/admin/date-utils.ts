// lib/admin/date-utils.ts
export function getDateRange(range?: string) {
  const to = new Date();
  const from = new Date();

  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "last30":
      from.setDate(to.getDate() - 30);
      break;
    case "thisMonth":
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      break;
    default: // last7 (Default)
      from.setDate(to.getDate() - 7);
  }

  return { from, to };
}