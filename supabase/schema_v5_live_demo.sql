-- ============================================================
-- MeatHub V5 — "Always-live demo" + full profile capture
-- Run this ONCE in the Supabase SQL Editor (after schema_v4.sql)
-- ============================================================

-- 1. Capture phone + city on signup (was only capturing name/email)
-- ------------------------------------------------------------
alter table profiles add column if not exists city text;

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email, phone, city)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city'
  )
  on conflict (id) do update set
    name  = excluded.name,
    phone = excluded.phone,
    city  = excluded.city;
  return new;
end;
$$;
-- trigger "on_auth_user_created" already points at this function — no need to recreate it.

-- 2. Keep demo groups perpetually open
-- ------------------------------------------------------------
-- Problem: ends_at is a fixed timestamp set at seed time (now() + a few days).
-- A few days later every countdown reads "נסגר" even though status is still
-- 'active', which looks broken in a live demo. This function rolls any
-- active-but-expired group's deadline forward by a fresh 2–7 day window,
-- and tops its group_products back up a bit so there's always room to "order".

create or replace function refresh_active_groups()
returns void language plpgsql security definer as $$
begin
  update groups
  set ends_at = now() + (2 + floor(random() * 6))::int * interval '1 day'
  where status = 'active'
    and ends_at < now();

  -- give expired-and-refreshed groups some breathing room again
  update group_products gp
  set filled_kg = round((gp.target_kg * (0.3 + random() * 0.4))::numeric, 0)
  from groups g
  where gp.group_id = g.id
    and g.status = 'active'
    and gp.filled_kg >= gp.target_kg;
end;
$$;

-- 3. Schedule it to run automatically every hour
-- ------------------------------------------------------------
-- Requires the pg_cron extension (Database → Extensions → enable "pg_cron").
-- If pg_cron isn't available on your plan, just run
--   select refresh_active_groups();
-- manually in the SQL Editor before each demo instead.

create extension if not exists pg_cron;

select cron.schedule(
  'refresh_active_groups_hourly',
  '0 * * * *',
  $$select refresh_active_groups();$$
);

-- Run it once now so groups are fresh immediately.
select refresh_active_groups();
