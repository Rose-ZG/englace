-- Run once in a NEW Supabase project. Public reads/writes are exposed ONLY by RPC.
create table public.community_letters(id uuid primary key default gen_random_uuid(),owner uuid not null references auth.users(id),name text not null,title text not null,body text not null,topic text not null,created_at timestamptz not null default now(),withdrawn boolean not null default false);
create table public.community_threads(id uuid primary key default gen_random_uuid(),letter uuid not null references public.community_letters(id),author uuid not null references auth.users(id),reader uuid not null references auth.users(id),reader_name text not null,created_at timestamptz not null default now(),unique(letter,reader),check(author<>reader));
create table public.community_messages(id uuid primary key default gen_random_uuid(),thread uuid not null references public.community_threads(id),sender uuid not null references auth.users(id),body text not null,created_at timestamptz not null default now());
create table public.community_reports(letter uuid not null references public.community_letters(id),reporter uuid not null references auth.users(id),reason text not null,created_at timestamptz not null default now(),primary key(letter,reporter));
create index on public.community_letters(created_at desc);
create index on public.community_messages(thread,created_at);
create index on public.community_threads(author);
create index on public.community_threads(reader);
alter table public.community_letters enable row level security;
alter table public.community_threads enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_reports enable row level security;
revoke all on public.community_letters,public.community_threads,public.community_messages,public.community_reports from anon,authenticated;

create function public.community_publish(p_name text,p_title text,p_body text,p_topic text) returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid(); result uuid;
begin
 if who is null then raise exception 'Authentication required'; end if;
 if length(trim(p_name)) not between 1 and 24 or length(trim(p_title)) not between 3 and 100 or length(trim(p_body)) not between 20 and 5000 or p_topic not in ('daily','study','culture','penpal') then raise exception 'Invalid letter'; end if;
 perform pg_advisory_xact_lock(hashtextextended(who::text,0));
 if (select count(*) from public.community_letters where owner=who and created_at>now()-interval '1 day')>=5 then raise exception 'Daily publishing limit reached'; end if;
 insert into public.community_letters(owner,name,title,body,topic) values(who,trim(p_name),trim(p_title),trim(p_body),p_topic) returning id into result;return result;
end $$;
create function public.community_feed(p_topic text default 'all') returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null then raise exception 'Authentication required';end if;
 return coalesce((select jsonb_agg(row_to_json(x)) from(select id,name,title,body,topic,created_at,(owner=auth.uid()) as mine from public.community_letters where not withdrawn and (p_topic='all' or topic=p_topic) order by created_at desc limit 40)x),'[]'::jsonb);
end $$;
create function public.community_open(p_letter uuid,p_name text) returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid(); owner_id uuid; result uuid;
begin
 if who is null or length(trim(p_name)) not between 1 and 24 then raise exception 'Invalid identity';end if;
 select owner into owner_id from public.community_letters where id=p_letter and not withdrawn;
 if owner_id is null or owner_id=who then raise exception 'Letter unavailable';end if;
 perform pg_advisory_xact_lock(hashtextextended(who::text,0));
 select id into result from public.community_threads where letter=p_letter and reader=who;
 if result is not null then return result;end if;
 if (select count(*) from public.community_threads where reader=who and created_at>now()-interval '1 day')>=10 then raise exception 'Daily conversation limit reached';end if;
 insert into public.community_threads(letter,author,reader,reader_name) values(p_letter,owner_id,who,trim(p_name)) returning id into result;return result;
end $$;
create function public.community_inbox() returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null then raise exception 'Authentication required';end if;
 return coalesce((select jsonb_agg(row_to_json(x)) from(select t.id,l.title,case when t.author=auth.uid() then t.reader_name else l.name end as partner,t.created_at from public.community_threads t join public.community_letters l on l.id=t.letter where t.author=auth.uid() or t.reader=auth.uid() order by t.created_at desc limit 100)x),'[]'::jsonb);
end $$;
create function public.community_messages_get(p_thread uuid) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or not exists(select 1 from public.community_threads where id=p_thread and (author=auth.uid() or reader=auth.uid())) then raise exception 'Conversation unavailable';end if;
 return coalesce((select jsonb_agg(row_to_json(x) order by x.created_at) from(select id,body,created_at,(sender=auth.uid()) as mine from public.community_messages where thread=p_thread order by created_at desc limit 100)x),'[]'::jsonb);
end $$;
create function public.community_send(p_thread uuid,p_body text) returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid(); result uuid;
begin
 if who is null or length(trim(p_body)) not between 1 and 5000 or not exists(select 1 from public.community_threads where id=p_thread and (author=who or reader=who)) then raise exception 'Message unavailable';end if;
 perform pg_advisory_xact_lock(hashtextextended(who::text,0));
 if (select count(*) from public.community_messages where sender=who and created_at>now()-interval '1 hour')>=30 then raise exception 'Hourly reply limit reached';end if;
 insert into public.community_messages(thread,sender,body) values(p_thread,who,trim(p_body)) returning id into result;return result;
end $$;
create function public.community_withdraw(p_letter uuid) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or not exists(select 1 from public.community_letters where id=p_letter and owner=auth.uid()) then raise exception 'Not your letter';end if;
 update public.community_letters set withdrawn=true where id=p_letter and owner=auth.uid();
end $$;
create function public.community_report(p_letter uuid,p_reason text) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if auth.uid() is null or length(trim(p_reason)) not between 3 and 500 or not exists(select 1 from public.community_letters where id=p_letter and not withdrawn) then raise exception 'Invalid report';end if;
 insert into public.community_reports(letter,reporter,reason) values(p_letter,auth.uid(),trim(p_reason)) on conflict(letter,reporter) do update set reason=excluded.reason;
end $$;
revoke all on function public.community_publish(text,text,text,text),public.community_feed(text),public.community_open(uuid,text),public.community_inbox(),public.community_messages_get(uuid),public.community_send(uuid,text),public.community_withdraw(uuid),public.community_report(uuid,text) from public,anon;
grant execute on function public.community_publish(text,text,text,text),public.community_feed(text),public.community_open(uuid,text),public.community_inbox(),public.community_messages_get(uuid),public.community_send(uuid,text),public.community_withdraw(uuid),public.community_report(uuid,text) to authenticated;
