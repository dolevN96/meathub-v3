-- Add image_url to products and importers
alter table products add column if not exists image_url text;
alter table importers add column if not exists image_url text;

-- Branches table (new pick-up locations)
create table if not exists branches (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  city text not null,
  phone text,
  lat numeric(9,6),
  lng numeric(9,6),
  opening_hours text,
  notes text
);

-- Add branch FK to groups
alter table groups add column if not exists branch_id uuid references branches(id) on delete set null;
