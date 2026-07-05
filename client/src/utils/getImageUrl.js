const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

export const getImageUrl = (path) => {
  if (!path) return "";
  return `${IMAGE_URL}${path}`;
};