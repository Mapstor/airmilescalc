/**
 * Display-name overrides for countries whose value in the OpenFlights
 * `airports.country` column is outdated, missing diacritics, or otherwise not
 * the current canonical / UN-recognised form.
 *
 * KEYS are the literal stored value (do NOT change them — DB lookups still
 * use the stored value as the join key). The override is applied only at the
 * UI rendering boundary via displayCountryName(), and in SEO metadata where
 * the canonical name is preferable for indexing.
 *
 * Sources for each rename:
 *   Macedonia        → North Macedonia  : Prespa agreement, Feb 2019.
 *   Swaziland        → Eswatini         : Renamed by King Mswati III, Apr 2018.
 *   East Timor       → Timor-Leste      : UN-recognised name on independence (2002).
 *   Cote d'Ivoire    → Côte d'Ivoire    : Official diacritic; UN form since 1985.
 *   Burma            → Myanmar          : Renamed 1989; UN form since.
 *   Cape Verde       → Cabo Verde       : Renamed Oct 2013 (Portuguese form).
 */
const COUNTRY_NAME_OVERRIDES: Record<string, string> = {
  'Macedonia': 'North Macedonia',
  'Swaziland': 'Eswatini',
  'East Timor': 'Timor-Leste',
  "Cote d'Ivoire": 'Côte d’Ivoire',
  'Burma': 'Myanmar',
  'Cape Verde': 'Cabo Verde',
};

/**
 * Returns the canonical display name for a country whose value comes from the
 * OpenFlights dataset. If no override exists, returns the input unchanged.
 *
 * Use this at every UI rendering site (and in SEO metadata where indexers
 * benefit from the current name). Do NOT use the result as a DB query key or
 * URL slug — those continue to use the stored (raw) value.
 */
export function displayCountryName(stored: string | null | undefined): string {
  if (!stored) return '';
  return COUNTRY_NAME_OVERRIDES[stored] ?? stored;
}
