export const getApiBase = (): string => {
  return (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
};

export const getVpsApiBase = (): string => {
  const url =
    (import.meta.env.VITE_VPS_API_URL as string) ||
    ((import.meta.env as any).VPS_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    '';
  return url.replace(/\/$/, '');
};
