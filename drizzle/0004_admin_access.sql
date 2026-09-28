CREATE TABLE IF NOT EXISTS user_access (
  user_id text PRIMARY KEY NOT NULL REFERENCES users(id),
  scope text NOT NULL DEFAULT 'OWN',
  site_access text NOT NULL DEFAULT 'PENDING',
  invited_at text,
  last_login_at text,
  created_at text NOT NULL,
  updated_at text NOT NULL
);
CREATE TABLE IF NOT EXISTS team_settings (
  team_id text PRIMARY KEY NOT NULL REFERENCES teams(id),
  manager_user_id text REFERENCES users(id),
  active integer NOT NULL DEFAULT 1,
  updated_at text NOT NULL
);
