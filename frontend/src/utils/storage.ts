// Safe LocalStorage Utility with automatic QuotaExceededError protection and eviction

export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    try {
      console.warn(`LocalStorage quota exceeded on '${key}'. Evicting non-essential caches...`, err);
      // Evict non-essential cached objects
      localStorage.removeItem('tcl_selected_product');
      localStorage.removeItem('tcl_selected_article');
      localStorage.removeItem('tcl_cms_bundle');
      localStorage.removeItem('tcl_user_orders');
      localStorage.removeItem('tcl_cms_orders');

      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch {
      // Gracefully suppress QuotaExceededError so the application NEVER crashes
      return false;
    }
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}
