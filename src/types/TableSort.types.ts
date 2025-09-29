export type TableSortKey = "name" | "status" | "date";

export const TABLE_SORT_OPTIONS: Record<TableSortKey, string> = {
  name: "Nom",
  status: "Statut",
  date: "Dernière mise à jour",
} as const;

export const isValidTableSortKey = (value: string): value is TableSortKey => {
  return value in TABLE_SORT_OPTIONS;
};
