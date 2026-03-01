create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  order_id text not null unique,
  order_name text not null,
  amount integer not null,
  status text not null check (status in ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED')),
  fail_reason text,
  payment_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payment_transactions enable row level security;

create policy "Users can view their own payment transactions."
  on public.payment_transactions for select
  using ( auth.uid() = user_id );

-- Server actions bypassing RLS or Service role key will be used for inserts and updates
-- to ensure they can be securely inserted/updated without exposing directly to the client
create policy "Users can insert their own payment transactions."
  on public.payment_transactions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own payment transactions."
  on public.payment_transactions for update
  using ( auth.uid() = user_id );
