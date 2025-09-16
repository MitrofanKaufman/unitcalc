// path: src/core/utils/search/validation.ts
export const isValidQuery = (q: string): boolean => {
  return typeof q === "string" && q.trim().length >= 2;
};
