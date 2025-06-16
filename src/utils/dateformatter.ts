export function formatDashYYYYMMDD(date: Date): string {
  return date.toISOString().split("T")[0]; // '2025-05-30'
}

export function formatYYYYMMDD(date: Date): string {
  return formatDashYYYYMMDD(date).replaceAll("-", ""); // '20250530'
}
