export const normalizeText = (str?: string | null): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const matchesSearchQuery = (source?: string | null, query?: string | null): boolean => {
  if (!query) return true;
  if (!source) return false;
  return normalizeText(source).includes(normalizeText(query));
};

export const sanitizeExternalUrl = (url?: string | null, fallback = ''): string => {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
};
