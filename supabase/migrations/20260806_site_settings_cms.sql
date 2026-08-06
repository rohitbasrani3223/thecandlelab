-- Run in Supabase Dashboard → SQL Editor (once) so CMS changes sync for all visitors.

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(30) DEFAULT 'STRING',
    group_name VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
CREATE POLICY "site_settings_public_read"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_settings_public_write_cms" ON site_settings;
CREATE POLICY "site_settings_public_write_cms"
  ON site_settings FOR INSERT
  WITH CHECK (setting_key = 'tcl_cms_bundle');

DROP POLICY IF EXISTS "site_settings_public_update_cms" ON site_settings;
CREATE POLICY "site_settings_public_update_cms"
  ON site_settings FOR UPDATE
  USING (setting_key = 'tcl_cms_bundle')
  WITH CHECK (setting_key = 'tcl_cms_bundle');
