export const getVpsApiBase = (): string => {
  const url =
    (import.meta.env.VITE_VPS_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    '';
  return url.replace(/\/$/, '');
};

export const getApiBase = (): string => {
  return getVpsApiBase();
};
