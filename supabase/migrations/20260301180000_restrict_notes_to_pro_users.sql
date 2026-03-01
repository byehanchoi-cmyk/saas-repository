-- Restrict note access to users who have completed payment (i.e. 'Pro' plan)
-- We need to change the policies to check `billing_plan = 'Pro'` in the public.users table.

-- First, drop the existing policies for public.notes so we can recreate them
drop policy if exists "Users can view their own notes." on public.notes;
drop policy if exists "Users can insert their own notes." on public.notes;
drop policy if exists "Users can update their own notes." on public.notes;
drop policy if exists "Users can delete their own notes." on public.notes;

drop policy if exists "Collaborators can view notes." on public.notes;
drop policy if exists "Editors and owners can update notes." on public.notes;

-- Create new policies relying on billing_plan
create policy "Pro users can view their own notes."
  on public.notes for select
  using ( auth.uid() = user_id and exists (select 1 from public.users where id = auth.uid() and billing_plan = 'Pro') );

create policy "Pro users can insert their own notes."
  on public.notes for insert
  with check ( auth.uid() = user_id and exists (select 1 from public.users where id = auth.uid() and billing_plan = 'Pro') );

create policy "Pro users can update their own notes."
  on public.notes for update
  using ( auth.uid() = user_id and exists (select 1 from public.users where id = auth.uid() and billing_plan = 'Pro') );

create policy "Pro users can delete their own notes."
  on public.notes for delete
  using ( auth.uid() = user_id and exists (select 1 from public.users where id = auth.uid() and billing_plan = 'Pro') );

-- Collaborator policies: the user trying to access must ALSO have Pro plan?
-- Or is it based on the owner having Pro plan? Usually, if the note exists, collaborators can view it regardless, 
-- but let's assume any action requires the active user to be Pro.
create policy "Pro Collaborators can view notes."
  on public.notes for select
  using ( 
    exists (select 1 from public.collaborators where note_id = id and user_id = auth.uid()) 
    and exists (select 1 from public.users where id = auth.uid() and billing_plan = 'Pro') 
  );

create policy "Pro Editors and owners can update notes."
  on public.notes for update
  using ( 
    exists (select 1 from public.collaborators where note_id = id and user_id = auth.uid() and role in ('owner', 'editor')) 
    and exists (select 1 from public.users where id = auth.uid() and billing_plan = 'Pro') 
  );
