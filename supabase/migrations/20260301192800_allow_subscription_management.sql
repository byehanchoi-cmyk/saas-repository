-- Enable row level security operations for user's own subscriptions
-- They need to be able to insert when checkout succeeds and update when they cancel

create policy "Users can insert their own subscriptions."
    on public.subscriptions for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own subscriptions."
    on public.subscriptions for update
    using ( auth.uid() = user_id );
