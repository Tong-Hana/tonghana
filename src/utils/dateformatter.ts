export function formatDashYYYYMMDD(date: Date): string {
  return date.toISOString().split("T")[0]; // '2025-05-30'
}

export function formatYYYYMMDD(date: Date): string {
  return formatDashYYYYMMDD(date).replaceAll("-", ""); // '20250530'
}

export function formatSmartDate(date: Date): string {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${hours}:${minutes}`;
  }

  const isThisYear = date.getFullYear() === now.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (isThisYear) {
    return `${month}월 ${day}일`;
  } else {
    const year = date.getFullYear();
    const padMonth = pad(month);
    const padDay = pad(day);
    return `${year}.${padMonth}.${padDay}`;
  }
}
