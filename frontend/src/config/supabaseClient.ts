// Supabase Client for The Candle Lab E-Commerce Platform

export const SUPABASE_URL = 'https://anaqrvrzbqhpgwjfpacx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYXFydnJ6YnFocGd3amZwYWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzMzMzIsImV4cCI6MjEwMDgwOTMzMn0.NDzAvxZDP_TSlq1sXm1AID9xL8AzYl3QCA2LwH0TAhs';

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

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
      const errText = await res.text();
      console.error(`Supabase DB query error on table ${table} [${res.status} ${res.statusText}]:`, errText);
      return null;
    }

    const data = await res.json();
    return data as T;
  } catch (err) {
    console.warn(`Supabase DB fetch failed on table ${table}:`, err);
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
