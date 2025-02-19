export const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return 'Never';
  
  // Use a fixed format that will be consistent between server and client
  const date = new Date(isoString);
  
  // Format: YYYY-MM-DD HH:mm:ss UTC
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
};