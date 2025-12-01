export function generateUnixTimestamp(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0
): number {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return Math.floor(date.getTime() / 1000);
}
