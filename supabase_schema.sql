-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'super_admin'
  plan_type TEXT DEFAULT 'free', -- 'free', 'standard', 'premium'
  plan_expiry TIMESTAMPTZ,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLAYLISTS (IPTV Playlist Management)
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  m3u_url TEXT,
  xtream_username TEXT,
  xtream_password TEXT,
  epg_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sync_interval_hours INT DEFAULT 24,
  last_synced TIMESTAMPTZ,
  next_sync TIMESTAMPTZ,
  channel_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHANNELS (IPTV Core System)
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  logo TEXT,
  category TEXT DEFAULT 'General',
  country TEXT DEFAULT 'International',
  stream_url TEXT NOT NULL,
  epg_id TEXT,
  quality TEXT DEFAULT 'HD', -- 'SD', 'HD', 'FHD', '4K'
  status TEXT DEFAULT 'ONLINE', -- 'ONLINE', 'SLOW', 'OFFLINE'
  latency_ms INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BACKUP STREAMS (Automatic Stream Backup)
CREATE TABLE IF NOT EXISTS channel_backups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  stream_url TEXT NOT NULL,
  priority INT DEFAULT 1,
  status TEXT DEFAULT 'ONLINE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EPG PROGRAMS (Electronic Program Guide)
CREATE TABLE IF NOT EXISTS epg_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REMINDERS
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES epg_programs(id) ON DELETE CASCADE,
  match_id UUID,
  remind_before_minutes INT DEFAULT 10,
  is_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SPORTS CENTER
CREATE TABLE IF NOT EXISTS sports_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_type TEXT NOT NULL, -- 'Football', 'Basketball', 'Tennis', etc.
  league TEXT NOT NULL,
  team_a TEXT NOT NULL,
  team_b TEXT NOT NULL,
  team_a_logo TEXT,
  team_b_logo TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'UPCOMING', -- 'UPCOMING', 'LIVE', 'FINISHED'
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  stream_channel_id UUID REFERENCES channels(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MOVIES & SERIES
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  poster TEXT,
  backdrop TEXT,
  description TEXT,
  release_year INT,
  rating NUMERIC(3, 1),
  genre TEXT[],
  stream_url TEXT NOT NULL,
  quality TEXT DEFAULT 'HD',
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  poster TEXT,
  backdrop TEXT,
  description TEXT,
  release_year INT,
  rating NUMERIC(3, 1),
  genre TEXT[],
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  season_number INT NOT NULL,
  episode_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  stream_url TEXT NOT NULL,
  duration_minutes INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER INTERACTION (Favorites, History, Continue Watching)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'channel', 'movie', 'series', 'match'
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'channel', 'movie', 'episode'
  item_id UUID NOT NULL,
  progress_seconds INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  last_watched TIMESTAMPTZ DEFAULT NOW()
);

-- 10. STREAM HEALTH REPORTS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS stream_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL, -- 'not_working', 'buffering', 'audio_issue', etc.
  description TEXT,
  status TEXT DEFAULT 'Open', -- 'Open', 'Investigating', 'Resolved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
