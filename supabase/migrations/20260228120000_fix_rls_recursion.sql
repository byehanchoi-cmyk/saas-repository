-- Fix infinite recursion on notes and collaborators RLS policies

-- Drop the old recursive policies
drop policy if exists "Collaborators can view collaborators of the note." on public.collaborators;
drop policy if exists "Owners can manage collaborators." on public.collaborators;

-- Recreate policy for viewing collaborators:
-- Users can view collaborators for a note if they are the owner of the note,
-- or if they are themselves a collaborator on that note.
-- To avoid recursion, we check note ownership directly against the table without triggering RLS using a subquery that might trigger it, 
-- Actually, a simple subquery still triggers RLS. Let's use a security definer function.

create or replace function public.is_note_owner(check_note_id uuid, check_user_id uuid)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  is_owner boolean;
begin
  select exists(select 1 from notes where id = check_note_id and user_id = check_user_id) into is_owner;
  return is_owner;
end;
$$;

create policy "Collaborators can view collaborators of the note."
  on public.collaborators for select
  using ( 
    public.is_note_owner(note_id, auth.uid())
    or
    note_id in (select note_id from public.collaborators where user_id = auth.uid())
  );

create policy "Owners can manage collaborators."
  on public.collaborators for all
  using ( public.is_note_owner(note_id, auth.uid()) );
