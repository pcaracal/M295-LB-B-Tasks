export const getTime = () => {
  const d: Date = new Date();
  const h: number = d.getHours();
  const m: number = d.getMinutes();
  const s: number = d.getSeconds();
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
};

export const logWithTime = (str: string) => {
  console.log(`${getTime()} - ${str}`);
};