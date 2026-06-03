/**
 * URL-friendly slug. Strips Unicode diacritics so "Côte d'Ivoire" becomes
 * "cote-d-ivoire" rather than "c-te-d-ivoire". Apostrophes / punctuation
 * become single dashes; multiple separators collapse.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
