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
  ('鸟类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/A_beautiful_colorful_202603191746.jpeg', 1),
  ('爬行与冷血类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/A_bright_green_202603191747.jpeg', 2),
  ('猫类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/A_fluffy_ginger_202603191746.jpeg', 3),
  ('水族与两栖类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/A_school_of_202603191747.jpeg', 4),
  ('犬类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/Border_Collie_resting_202603191746.jpeg', 5),
  ('犬类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/Golden_Retriever_holding_202603191746.jpeg', 6),
  ('猫类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/Kitten_pawing_feathered_202603191746.jpeg', 7),
  ('鸟类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/Lovebird_eating_seed_202603191747.jpeg', 8),
  ('水族与两栖类', 'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/start%20page/Toad_hiding_under_202603191747.jpeg', 9)
on conflict (display_order) do update
set
  title = excluded.title,
  image_url = excluded.image_url;
