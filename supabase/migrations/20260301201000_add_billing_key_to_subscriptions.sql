-- Add billing_key to subscriptions to store Toss Payments billing keys for automated renewals
alter table public.subscriptions add column billing_key text;
