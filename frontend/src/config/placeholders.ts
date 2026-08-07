export const PRODUCT_IMAGE_PLACEHOLDER = '/hero_candle.png';

/** Shown when CMS hero/collection banners are not configured yet. */
export const CMS_BANNER_PLACEHOLDER = '/logo.jpeg';

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
