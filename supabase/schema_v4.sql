-- ============================================================
-- MeatHub V4 — Full Schema
-- Run this in Supabase SQL Editor (replaces all previous schemas)
-- ============================================================

-- 1. PROFILES
create table if not exists profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  name       text,
  email      text,
  phone      text,
  created_at timestamptz default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. IMPORTERS
create table if not exists importers (
  id           uuid default gen_random_uuid() primary key,
  slug         text unique not null,
  name         text not null,
  name_en      text,
  origin       text,
  origin_en    text,
  rating       numeric(3,1),
  reviews      int,
  verified     boolean default true,
  logo         text,
  image_url    text,
  address      text,
  company_id   text,
  contact_info text
);

-- 3. PRODUCTS
create table if not exists products (
  id             uuid default gen_random_uuid() primary key,
  slug           text unique not null,
  name           text not null,
  name_en        text,
  importer_id    uuid references importers(id) on delete set null,
  grade          text,
  grade_label    text,
  cut_number     int,
  producer       text,
  origin_country text,
  marbling_score text,
  price_retail   numeric(10,2),
  price_group    numeric(10,2),
  weight         numeric(10,2),
  unit           text default 'ק"ג',
  category       text,
  category_en    text,
  description    text
);

-- 4. BRANCHES
create table if not exists branches (
  id            uuid default gen_random_uuid() primary key,
  name          text not null,
  address       text not null,
  city          text not null,
  region        text not null,
  phone         text,
  lat           numeric(9,6),
  lng           numeric(9,6),
  opening_hours text,
  notes         text
);

-- 5. GROUPS = Delivery Events
create table if not exists groups (
  id       uuid default gen_random_uuid() primary key,
  slug     text unique not null,
  title    text not null,
  title_en text,
  branch_id uuid references branches(id) on delete set null,
  ends_at  timestamptz,
  status   text default 'active' check (status in ('active','closed','cancelled'))
);

-- 6. GROUP_PRODUCTS — junction: cuts available per event
create table if not exists group_products (
  id         uuid default gen_random_uuid() primary key,
  group_id   uuid references groups(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  target_kg  numeric(10,2) default 20,
  filled_kg  numeric(10,2) default 0,
  unique(group_id, product_id)
);

-- 7. GROUP_PARTICIPANTS
create table if not exists group_participants (
  id         uuid default gen_random_uuid() primary key,
  group_id   uuid references groups(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  kg_ordered numeric(10,2),
  created_at timestamptz default now(),
  unique(group_id, user_id, product_id)
);

-- 8. ORDERS
create table if not exists orders (
  id                uuid default gen_random_uuid() primary key,
  user_id           uuid references auth.users(id) on delete cascade,
  status            text default 'pending',
  total_amount      numeric(10,2),
  pickup_code       text,
  payment_reference text,
  created_at        timestamptz default now()
);

-- 9. ORDER_ITEMS
create table if not exists order_items (
  id           uuid default gen_random_uuid() primary key,
  order_id     uuid references orders(id) on delete cascade,
  group_id     uuid references groups(id) on delete set null,
  product_id   uuid references products(id) on delete set null,
  kg           numeric(10,2),
  price_per_kg numeric(10,2),
  total        numeric(10,2)
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

alter table profiles enable row level security;
drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles for all using (auth.uid() = id);

alter table importers enable row level security;
drop policy if exists "public read importers" on importers;
create policy "public read importers" on importers for select using (true);

alter table products enable row level security;
drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);

alter table branches enable row level security;
drop policy if exists "public read branches" on branches;
create policy "public read branches" on branches for select using (true);

alter table groups enable row level security;
drop policy if exists "public read groups" on groups;
create policy "public read groups" on groups for select using (true);

alter table group_products enable row level security;
drop policy if exists "public read group_products" on group_products;
create policy "public read group_products" on group_products for select using (true);

alter table group_participants enable row level security;
drop policy if exists "own participants" on group_participants;
create policy "own participants" on group_participants for all using (auth.uid() = user_id);

alter table orders enable row level security;
drop policy if exists "own orders" on orders;
create policy "own orders" on orders for all using (auth.uid() = user_id);

alter table order_items enable row level security;
drop policy if exists "own order items" on order_items;
create policy "own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ============================================================
-- RPC: checkout_cart
-- ============================================================

create or replace function checkout_cart(cart_items jsonb)
returns json language plpgsql security definer as $$
declare
  v_user_id    uuid := auth.uid();
  v_order_id   uuid;
  v_total      numeric(10,2) := 0;
  v_pickup     text;
  v_item       jsonb;
  v_gp         group_products%rowtype;
  v_new_filled numeric(10,2);
  v_item_total numeric(10,2);
begin
  if v_user_id is null then
    return json_build_object('error', 'not_authenticated');
  end if;

  v_pickup := upper(substring(md5(gen_random_uuid()::text), 1, 6));

  insert into orders (user_id, status, total_amount, pickup_code)
  values (v_user_id, 'pending', 0, v_pickup)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(cart_items)
  loop
    select * into v_gp
    from group_products
    where group_id   = (v_item->>'group_id')::uuid
      and product_id = (v_item->>'product_id')::uuid
    for update;

    if not found then
      raise exception 'group_product_not_found:%:%',
        v_item->>'group_id', v_item->>'product_id';
    end if;

    v_new_filled := v_gp.filled_kg + (v_item->>'kg')::numeric;

    if v_new_filled > v_gp.target_kg then
      raise exception 'exceeds_capacity:%:%:available:%',
        v_item->>'group_id',
        v_item->>'product_id',
        (v_gp.target_kg - v_gp.filled_kg)::text;
    end if;

    v_item_total := (v_item->>'kg')::numeric * (v_item->>'price_per_kg')::numeric;
    v_total      := v_total + v_item_total;

    insert into order_items (order_id, group_id, product_id, kg, price_per_kg, total)
    values (
      v_order_id,
      (v_item->>'group_id')::uuid,
      (v_item->>'product_id')::uuid,
      (v_item->>'kg')::numeric,
      (v_item->>'price_per_kg')::numeric,
      v_item_total
    );

    insert into group_participants (group_id, product_id, user_id, kg_ordered)
    values (
      (v_item->>'group_id')::uuid,
      (v_item->>'product_id')::uuid,
      v_user_id,
      (v_item->>'kg')::numeric
    )
    on conflict (group_id, user_id, product_id)
    do update set kg_ordered = excluded.kg_ordered;

    update group_products
    set filled_kg = v_new_filled
    where group_id   = (v_item->>'group_id')::uuid
      and product_id = (v_item->>'product_id')::uuid;
  end loop;

  update orders set total_amount = v_total where id = v_order_id;

  return json_build_object(
    'success',     true,
    'order_id',    v_order_id,
    'total',       v_total,
    'pickup_code', v_pickup
  );

exception
  when others then
    return json_build_object('error', sqlerrm);
end;
$$;

-- ============================================================
-- REALTIME: Enable on group_products in Supabase Dashboard
-- Table Editor → group_products → Enable Realtime
-- ============================================================
