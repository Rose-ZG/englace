create table public.englace_accounts (
 login_id text primary key check(login_id ~ '^[a-z][a-z0-9_]{3,23}$'),
 user_id uuid unique not null references auth.users(id) on delete cascade,
 auth_email text unique not null,
 recovery_salt text not null,
 recovery_hashes jsonb not null check(jsonb_array_length(recovery_hashes)=3),
 created_at timestamptz not null default now()
);
create table public.englace_account_limits (
 bucket text primary key,
 started_at timestamptz not null default now(),
 attempts integer not null default 1
);
alter table public.englace_accounts enable row level security;
alter table public.englace_account_limits enable row level security;
revoke all on public.englace_accounts,public.englace_account_limits from public,anon,authenticated;
grant select,insert,update,delete on public.englace_accounts,public.englace_account_limits to service_role;
create function public.englace_account_limit(p_bucket text,p_limit integer) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare value integer;
begin
 if p_limit<1 or p_limit>200 or length(p_bucket)>100 then return false;end if;
 insert into public.englace_account_limits(bucket) values(p_bucket)
 on conflict(bucket) do update set attempts=case when englace_account_limits.started_at<now()-interval '1 hour' then 1 else englace_account_limits.attempts+1 end,started_at=case when englace_account_limits.started_at<now()-interval '1 hour' then now() else englace_account_limits.started_at end
 returning attempts into value;
 return value<=p_limit;
end $$;
revoke all on function public.englace_account_limit(text,integer) from public,anon,authenticated;
grant execute on function public.englace_account_limit(text,integer) to service_role;
