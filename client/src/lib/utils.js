export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) return null;
  
  if (!file.type.startsWith('image/')) {
    return "Only image files are allowed";
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image size should be less than ${maxSizeMB}MB`;
  }
  
  return null;
};
