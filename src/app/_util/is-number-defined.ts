export const isNumberDefined = (n: number): boolean => {
  return (typeof n === 'number') && isFinite(n) && !isNaN(n);
};
