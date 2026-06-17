-- profiles (auto-created by trigger on auth.users insert)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  phone text,
  created_at timestamptz default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create table importers (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  name_en text,
  origin text,
  origin_en text,
  rating numeric(3,1),
  reviews int,
  verified boolean default true,
  logo text
);

create table products (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  name_en text,
  importer_id uuid references importers(id) on delete set null,
  grade text,
  grade_label text,
  price_retail numeric(10,2),
  price_group numeric(10,2),
  weight numeric(10,2),
  unit text,
  category text,
  category_en text,
  description text,
  color1 text,
  color2 text
);

create table groups (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  product_id uuid references products(id) on delete cascade,
  importer_id uuid references importers(id) on delete set null,
  title text,
  title_en text,
  location text,
  location_en text,
  pickup text,
  pickup_en text,
  total_kg numeric(10,2),
  filled_kg numeric(10,2) default 0,
  min_kg numeric(10,2),
  max_participants int,
  ends_at timestamptz,
  status text default 'active'
);

create table group_participants (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  kg_ordered numeric(10,2),
  created_at timestamptz default now(),
  unique(group_id, user_id)
);

create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  status text default 'pending',
  total_amount numeric(10,2),
  created_at timestamptz default now()
);

create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  group_id uuid references groups(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  kg numeric(10,2),
  price_per_kg numeric(10,2),
  total numeric(10,2)
);

create or replace function checkout_cart(cart_items jsonb)
returns json language plpgsql security definer as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_group groups%rowtype;
  v_new_filled numeric(10,2);
  v_item_total numeric(10,2);
begin
  if v_user_id is null then
    return json_build_object('error', 'not_authenticated');
  end if;

  insert into orders (user_id, status, total_amount)
  values (v_user_id, 'pending', 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(cart_items)
  loop
    select * into v_group
    from groups
    where id = (v_item->>'group_id')::uuid
    for update;

    if not found then
      raise exception 'group_not_found:%', v_item->>'group_id';
    end if;

    if v_group.status <> 'active' then
      raise exception 'group_not_active:%', v_group.id;
    end if;

    v_new_filled := v_group.filled_kg + (v_item->>'kg')::numeric;

    if v_new_filled > v_group.total_kg then
      raise exception 'exceeds_capacity:%:available:%',
        v_group.id,
        (v_group.total_kg - v_group.filled_kg)::text;
    end if;

    v_item_total := (v_item->>'kg')::numeric * (v_item->>'price_per_kg')::numeric;
    v_total := v_total + v_item_total;

    insert into order_items (order_id, group_id, product_id, kg, price_per_kg, total)
    values (
      v_order_id,
      (v_item->>'group_id')::uuid,
      (v_item->>'product_id')::uuid,
      (v_item->>'kg')::numeric,
      (v_item->>'price_per_kg')::numeric,
      v_item_total
    );

    insert into group_participants (group_id, user_id, kg_ordered)
    values ((v_item->>'group_id')::uuid, v_user_id, (v_item->>'kg')::numeric)
    on conflict (group_id, user_id) do update set kg_ordered = excluded.kg_ordered;

    update groups set filled_kg = v_new_filled
    where id = (v_item->>'group_id')::uuid;
  end loop;

  update orders set total_amount = v_total where id = v_order_id;

  return json_build_object('success', true, 'order_id', v_order_id, 'total', v_total);

exception
  when others then
    return json_build_object('error', sqlerrm);
end;
$$;

alter table profiles enable row level security;
create policy "own profile" on profiles for all using (auth.uid() = id);

alter table importers enable row level security;
create policy "public read importers" on importers for select using (true);

alter table products enable row level security;
create policy "public read products" on products for select using (true);

alter table groups enable row level security;
create policy "public read groups" on groups for select using (true);

alter table group_participants enable row level security;
create policy "own participants" on group_participants for all using (auth.uid() = user_id);

alter table orders enable row level security;
create policy "own orders" on orders for all using (auth.uid() = user_id);

alter table order_items enable row level security;
create policy "own order items" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- IMPORTANT: Enable Realtime on the 'groups' table in Supabase Dashboard > Table Editor > groups > Enable Realtime
