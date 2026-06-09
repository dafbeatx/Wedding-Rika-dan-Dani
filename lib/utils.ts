/**
 * Converts a guest name into a URL-friendly slug.
 * Example: "Ahmad Rizki & Keluarga" -> "ahmad-rizki-dan-keluarga"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Replace custom connectors like '&' with 'dan'
    .replace(/&/g, 'dan')
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces or hyphens with a single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Decodes a URL-friendly slug back to a readable guest name (fallback if DB query fails).
 * Example: "ahmad-rizki-dan-keluarga" -> "Ahmad Rizki dan Keluarga"
 */
export function decodeSlug(slug: string): string {
  if (!slug) return '';
  return decodeURIComponent(slug)
    .split('-')
    .map(word => {
      if (word.toLowerCase() === 'dan') return 'dan';
      if (word.toLowerCase() === 'di') return 'di';
      if (word.toLowerCase() === 'ke') return 'ke';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Simple utility to merge Tailwind CSS classes conditionally
 */
export function cn(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
  const result: string[] = [];
  
  classes.forEach(item => {
    if (!item) return;
    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      Object.entries(item).forEach(([key, val]) => {
        if (val) result.push(key);
      });
    }
  });

  return result.join(' ');
}

/**
 * Formats date into standard Indonesian format.
 * Example: "2026-06-14" -> "Minggu, 14 Juni 2026"
 */
export function formatDateIndonesian(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}
