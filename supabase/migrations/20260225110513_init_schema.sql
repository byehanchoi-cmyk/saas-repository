-- Create public.users table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  billing_plan text default 'Personal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can view all profiles."
  on public.users for select
  using ( true );
  
create policy "Users can update their own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Create trigger to sync auth.users to public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create public.folders table
create table public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.folders enable row level security;

create policy "Users can view their own folders."
  on public.folders for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own folders."
  on public.folders for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own folders."
  on public.folders for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own folders."
  on public.folders for delete
  using ( auth.uid() = user_id );


-- Create public.notes table
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text not null default 'Untitled',
  content text,
  is_pinned boolean default false,
  is_trashed boolean default false,
  is_favorite boolean default false,
  word_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can view their own notes."
  on public.notes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own notes."
  on public.notes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own notes."
  on public.notes for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own notes."
  on public.notes for delete
  using ( auth.uid() = user_id );

-- Create public.tags table
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, name)
);

alter table public.tags enable row level security;

create policy "Users can view their own tags."
  on public.tags for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own tags."
  on public.tags for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own tags."
  on public.tags for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own tags."
  on public.tags for delete
  using ( auth.uid() = user_id );


-- Create public.note_tags table
create table public.note_tags (
  note_id uuid references public.notes(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

alter table public.note_tags enable row level security;

create policy "Users can view note tags for their notes."
  on public.note_tags for select
  using ( exists (select 1 from public.notes where id = note_tags.note_id and user_id = auth.uid()) );

create policy "Users can insert note tags for their notes."
  on public.note_tags for insert
  with check ( exists (select 1 from public.notes where id = note_tags.note_id and user_id = auth.uid()) );

create policy "Users can delete note tags for their notes."
  on public.note_tags for delete
  using ( exists (select 1 from public.notes where id = note_tags.note_id and user_id = auth.uid()) );


-- Create public.collaborators table
create table public.collaborators (
  note_id uuid references public.notes(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (note_id, user_id)
);

alter table public.collaborators enable row level security;

create policy "Collaborators can view collaborators of the note."
  on public.collaborators for select
  using ( 
    exists (select 1 from public.notes where id = collaborators.note_id and user_id = auth.uid())
    or
    exists (select 1 from public.collaborators as c where c.note_id = collaborators.note_id and c.user_id = auth.uid())
  );

create policy "Owners can manage collaborators."
  on public.collaborators for all
  using ( exists (select 1 from public.notes where id = collaborators.note_id and user_id = auth.uid()) );

-- Update notes RLS to include collaborators
create policy "Collaborators can view notes."
  on public.notes for select
  using ( exists (select 1 from public.collaborators where note_id = id and user_id = auth.uid()) );

create policy "Editors and owners can update notes."
  on public.notes for update
  using ( exists (select 1 from public.collaborators where note_id = id and user_id = auth.uid() and role in ('owner', 'editor')) );


-- Create public.subscriptions table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_name text not null,
  status text not null,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions."
  on public.subscriptions for select
  using ( auth.uid() = user_id );
