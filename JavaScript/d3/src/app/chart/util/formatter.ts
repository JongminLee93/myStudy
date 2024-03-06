export const toSIUnit = (value: string | number) => {
  if (typeof value === 'string') return value.toString();

  const to = 1;
  if (Math.abs(value) < 1e3) return value.toString();
  else if (Math.abs(value) >= 1e3 && Math.abs(value) < 1e6) return (value / 1e3).toFixed(to) + 'K';
  else if (Math.abs(value) >= 1e6 && Math.abs(value) < 1e9) return (value / 1e6).toFixed(to) + 'M';
  else if (Math.abs(value) >= 1e9 && Math.abs(value) < 1e12) return (value / 1e9).toFixed(to) + 'G';
  else if (Math.abs(value) >= 1e12 && Math.abs(value) < 1e15) return (value / 1e12).toFixed(to) + 'T';
  else if (Math.abs(value) >= 1e15 && Math.abs(value) < 1e18) return (value / 1e15).toFixed(to) + 'P';
  else return value.toString(); // 값을 그대로 반환
}
