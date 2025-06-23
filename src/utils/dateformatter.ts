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

export function formatTime(
  date: Date,
  format: "HH:mm:ss" | "HH:mm" | "hh:mm a" = "HH:mm",
) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours24 < 12 ? "오전" : "오후";

  switch (format) {
    case "HH:mm:ss":
      return `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
    case "HH:mm":
      return `${pad(hours24)}:${pad(minutes)}`;
    case "hh:mm a":
      return `${pad(hours12)}:${pad(minutes)} ${ampm}`;
    default:
      throw new Error("Unsupported format");
  }
}
