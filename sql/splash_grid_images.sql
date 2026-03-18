create extension if not exists pgcrypto;

create table if not exists public.splash_grid_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  display_order integer not null unique,
  created_at timestamptz not null default now()
);

alter table public.splash_grid_images enable row level security;

create policy if not exists "Allow public read splash grid images"
on public.splash_grid_images
for select
to anon, authenticated
using (true);

insert into public.splash_grid_images (title, image_url, display_order)
values
  ('猫类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/cat.png', 1),
  ('犬类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/dog.png', 2),
  ('鸟类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/bird.png', 3),
  ('水族与两栖类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/fish.png', 4),
  ('爬行与冷血类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/reptile.png', 5),
  ('猫类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/cat.png', 6),
  ('犬类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/dog.png', 7),
  ('鸟类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/bird.png', 8),
  ('水族与两栖类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/fish.png', 9)
on conflict (display_order) do update
set
  title = excluded.title,
  image_url = excluded.image_url;
