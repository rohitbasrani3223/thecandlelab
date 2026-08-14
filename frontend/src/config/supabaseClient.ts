// Supabase Client for The Candle Lab E-Commerce Platform

export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://anaqrvrzbqhpgwjfpacx.supabase.co';

export const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

export async function supabaseUpsertByKey(
  table: string,
  body: Record<string, unknown>,
  onConflict: string
): Promise<boolean> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Supabase upsert error on ${table} [${res.status}]:`, errText);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase upsert failed on ${table}:`, err);
    return false;
  }
}

export async function supabaseFetch<T>(table: string, options: { method?: string; query?: string; body?: any } = {}): Promise<T | null> {
  try {
    const { method = 'GET', query = '', body } = options;
    const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      // If 404 (table doesn't exist yet in remote schema), gracefully return null
      if (res.status === 404) {
        return null;
      }
      // If 400 and there was a query (e.g. order by non-existent column), retry without query
      if (res.status === 400 && query && method === 'GET') {
        const retryRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'GET',
          headers,
        });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          return retryData as T;
        }
      }
      return null;
    }

    const data = await res.json();
    return data as T;
  } catch (err) {
    return null;
  }
}

export async function uploadImageToSupabaseStorage(file: File, bucket = 'product-images'): Promise<string> {
  try {
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${cleanFileName}`;

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!res.ok) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanFileName}`;
  } catch (err) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
