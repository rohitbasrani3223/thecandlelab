import { supabaseFetch, supabaseUpsertByKey } from '../config/supabaseClient';
import type {
  CMSAnnouncement,
  CMSCollection,
  CMSHeroBanner,
  CMSMediaItem,
  CMSPagesContent,
  CMSSEOSetting,
  CMSStoreSettings,
} from '../context/CMSContext';

export const CMS_BUNDLE_KEY = 'tcl_cms_bundle';

export interface CmsRemoteBundle {
  version: 1;
  updatedAt?: string;
  settings?: CMSStoreSettings;
  announcement?: CMSAnnouncement;
  hero?: CMSHeroBanner;
  pagesContent?: CMSPagesContent;
  seoSettings?: CMSSEOSetting[];
  collections?: CMSCollection[];
  mediaItems?: CMSMediaItem[];
}

export async function fetchCmsBundle(): Promise<CmsRemoteBundle | null> {
  const rows = await supabaseFetch<{ setting_value: string }[]>('site_settings', {
    query: `select=setting_value&setting_key=eq.${CMS_BUNDLE_KEY}`,
  });
  const raw = rows?.[0]?.setting_value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CmsRemoteBundle;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveCmsBundle(bundle: CmsRemoteBundle): Promise<boolean> {
  const payload = {
    setting_key: CMS_BUNDLE_KEY,
    setting_value: JSON.stringify({ ...bundle, version: 1 as const, updatedAt: new Date().toISOString() }),
    setting_type: 'JSON',
    group_name: 'CMS',
  };

  const upserted = await supabaseUpsertByKey('site_settings', payload, 'setting_key');
  if (upserted) return true;

  const patched = await supabaseFetch<unknown[]>('site_settings', {
    method: 'PATCH',
    query: `setting_key=eq.${CMS_BUNDLE_KEY}`,
    body: { setting_value: payload.setting_value, setting_type: 'JSON', group_name: 'CMS' },
  });
  if (Array.isArray(patched) && patched.length > 0) return true;

  const inserted = await supabaseFetch<unknown[]>('site_settings', {
    method: 'POST',
    body: payload,
  });
  return Array.isArray(inserted) ? inserted.length > 0 : Boolean(inserted);
}
