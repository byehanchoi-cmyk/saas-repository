-- 1. Create Handle Updated At Function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers to existing tables
create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger on_folders_updated
  before update on public.folders
  for each row execute procedure public.handle_updated_at();

create trigger on_notes_updated
  before update on public.notes
  for each row execute procedure public.handle_updated_at();

create trigger on_tags_updated
  before update on public.tags
  for each row execute procedure public.handle_updated_at();

create trigger on_subscriptions_updated
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();


-- 2. Add constraint for billing_plan
alter table public.users 
  add constraint check_billing_plan 
  check (billing_plan in ('Personal', 'Pro', 'Team'));

-- 3. Sync metadata updates from auth to public
create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.users
  set 
    email = new.email,
    full_name = new.raw_user_meta_data->>'full_name',
    avatar_url = new.raw_user_meta_data->>'avatar_url',
    updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();


-- 4. Create public.note_versions table (for Pro features)
create table public.note_versions (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamp with time zone default now() not null
);

alter table public.note_versions enable row level security;

create policy "Users can view versions of notes they can access."
  on public.note_versions for select
  using (
    exists (
      select 1 from public.notes 
      where id = note_id and (
        user_id = auth.uid() 
        or exists (select 1 from public.collaborators where note_id = id and user_id = auth.uid())
      )
    )
  );

create policy "Users can create versions for notes they can edit."
  on public.note_versions for insert
  with check (
    exists (
      select 1 from public.notes 
      where id = note_id and (
        user_id = auth.uid() 
        or exists (select 1 from public.collaborators where note_id = id and user_id = auth.uid() and role in ('owner', 'editor'))
      )
    )
  );


-- 5. Update Policies for note_tags to allow collaborators
-- Drop old policies
drop policy if exists "Users can view note tags for their notes." on public.note_tags;
drop policy if exists "Users can insert note tags for their notes." on public.note_tags;
drop policy if exists "Users can delete note tags for their notes." on public.note_tags;

-- Recreate policies with collaborator logic
create policy "Users can view tags for notes they can access."
  on public.note_tags for select
  using (
    exists (
      select 1 from public.notes 
      where id = note_id and (
        user_id = auth.uid() 
        or exists (select 1 from public.collaborators where note_id = notes.id and user_id = auth.uid())
      )
    )
  );

create policy "Users can manage tags for notes they can edit."
  on public.note_tags for all
  using (
    exists (
      select 1 from public.notes 
      where id = note_id and (
        user_id = auth.uid() 
        or exists (select 1 from public.collaborators where note_id = notes.id and user_id = auth.uid() and role in ('owner', 'editor'))
      )
    )
  );


-- 6. Update Policies for notes to allow viewing and editing by collaborators
drop policy if exists "Users can view their own notes." on public.notes;
drop policy if exists "Users can update their own notes." on public.notes;

create policy "Users can view notes they own or collaborate on."
  on public.notes for select
  using ( 
    auth.uid() = user_id 
    or 
    exists (
      select 1 from public.collaborators 
      where note_id = public.notes.id and user_id = auth.uid()
    )
  );

create policy "Users can update notes they own or have editor role on."
  on public.notes for update
  using ( 
    auth.uid() = user_id 
    or 
    exists (
      select 1 from public.collaborators 
      where note_id = public.notes.id and user_id = auth.uid() and role in ('owner', 'editor')
    )
  );

-- 7. Helpful indexes for efficient RLS and joins
create index if not exists idx_notes_user_id on public.notes(user_id);
create index if not exists idx_notes_folder_id on public.notes(folder_id);
create index if not exists idx_notes_is_trashed on public.notes(is_trashed);
create index if not exists idx_collaborators_note_id on public.collaborators(note_id);
create index if not exists idx_collaborators_user_id on public.collaborators(user_id);
create index if not exists idx_note_versions_note_id on public.note_versions(note_id);
