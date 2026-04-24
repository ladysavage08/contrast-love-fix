export const PUBLIC_HEALTH_SERIES_CATEGORY = "What Is Public Health Series";

export const PUBLIC_HEALTH_SERIES_PATH = "/news/what-is-public-health-article-series";

export function isPublicHealthSeriesPost(category: string | null | undefined) {
  return category?.trim().toLowerCase() === PUBLIC_HEALTH_SERIES_CATEGORY.toLowerCase();
}