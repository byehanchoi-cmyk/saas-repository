-- Fix infinite recursion on notes and collaborators RLS policies, part 2
-- The previous attempt still caused recursion because querying collaborators inside collaborators policy triggers the policy again.
-- We must use a security definer function to check collaboration without triggering RLS.

drop policy if exists "Collaborators can view collaborators of the note." on public.collaborators;

create or replace function public.is_collaborator(check_note_id uuid, check_user_id uuid)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  is_collab boolean;
begin
  select exists(select 1 from collaborators where note_id = check_note_id and user_id = check_user_id) into is_collab;
  return is_collab;
end;
$$;

create policy "Collaborators can view collaborators of the note."
  on public.collaborators for select
  using ( 
    public.is_note_owner(note_id, auth.uid())
    or
    public.is_collaborator(note_id, auth.uid())
  );

-- We also need to fix public.notes policy for select to use the same function, just in case
drop policy if exists "Collaborators can view notes." on public.notes;

create policy "Collaborators can view notes."
  on public.notes for select
  using ( public.is_collaborator(id, auth.uid()) );

-- And update notes too:
drop policy if exists "Editors and owners can update notes." on public.notes;
create policy "Editors and owners can update notes."
  on public.notes for update
  using ( 
     -- owner is implicitly handled by the original policy, but for collaborators:
     exists(select 1 from collaborators where note_id = id and user_id = auth.uid() and role in ('owner', 'editor')) 
     -- wait, querying collaborators from notes is fine, but we can also use a security definer function if needed. It shouldn't recurse unless collaborators queries notes.
  );
