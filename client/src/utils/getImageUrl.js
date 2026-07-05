const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getImageUrl = (path) => {
  if (!path) return "";
  return `${BASE_URL}${path}`;
};