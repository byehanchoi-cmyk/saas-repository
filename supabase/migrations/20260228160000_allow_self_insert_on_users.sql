-- Allow users to insert their own profile to handle cases where the auth trigger didn't run
drop policy if exists "Users can insert their own profile." on public.users;
create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );
