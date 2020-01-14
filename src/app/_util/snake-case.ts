export const toSnakeCase = (str: string) => {
  return !str ? '' : String(str)
    .replace(/^\W+|\W+$/gi, '')
    .replace(/\W+/gi, '_')
    .toLowerCase();
};
