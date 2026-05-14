create table if not exists chat_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  flagged boolean not null default false,
  flag_reason text,
  created_at timestamptz not null default now()
);
create index on chat_logs(session_id);
create index on chat_logs(flagged);
create index on chat_logs(created_at desc);
