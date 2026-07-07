-- ============================================================
-- Scripture Alive — Bible Study Community Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── 1. Rooms (like subreddits) ──────────────────────────────
CREATE TABLE IF NOT EXISTS community_rooms (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  slug         text NOT NULL UNIQUE,
  description  text,
  category     text DEFAULT 'General',   -- e.g. "Old Testament", "Doctrine", "Prayer"
  icon         text DEFAULT '📖',
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  member_count int  NOT NULL DEFAULT 0,
  post_count   int  NOT NULL DEFAULT 0,
  is_official  boolean NOT NULL DEFAULT false,  -- admin-curated rooms
  is_locked    boolean NOT NULL DEFAULT false,  -- no new posts allowed
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_rooms_slug_idx ON community_rooms(slug);
CREATE INDEX IF NOT EXISTS community_rooms_category_idx ON community_rooms(category);

-- ── 2. Posts ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id        uuid NOT NULL REFERENCES community_rooms(id) ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title          text NOT NULL,
  body           text,
  post_type      text NOT NULL DEFAULT 'discussion',  -- 'discussion' | 'question' | 'scripture'
  upvote_count   int  NOT NULL DEFAULT 0,
  comment_count  int  NOT NULL DEFAULT 0,
  is_pinned      boolean NOT NULL DEFAULT false,
  is_locked      boolean NOT NULL DEFAULT false,   -- no new comments
  is_removed     boolean NOT NULL DEFAULT false,
  removed_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  removed_reason text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_posts_room_idx    ON community_posts(room_id, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_user_idx    ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_pinned_idx  ON community_posts(room_id, is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS community_posts_removed_idx ON community_posts(is_removed);

-- ── 3. Comments ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_comments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id           uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES community_comments(id) ON DELETE CASCADE,
  body              text NOT NULL,
  upvote_count      int  NOT NULL DEFAULT 0,
  is_removed        boolean NOT NULL DEFAULT false,
  removed_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  removed_reason    text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_comments_post_idx    ON community_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS community_comments_parent_idx  ON community_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS community_comments_removed_idx ON community_comments(is_removed);

-- ── 4. Votes ────────────────────────────────────────────────
-- One vote per user per target (enforced by unique constraint)
CREATE TABLE IF NOT EXISTS community_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL,                             -- post or comment id
  target_type text NOT NULL CHECK (target_type IN ('post','comment')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_id, target_type)
);

CREATE INDEX IF NOT EXISTS community_votes_target_idx ON community_votes(target_id, target_type);
CREATE INDEX IF NOT EXISTS community_votes_user_idx   ON community_votes(user_id);

-- ── 5. Room Memberships ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_members (
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id   uuid NOT NULL REFERENCES community_rooms(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, room_id)
);

CREATE INDEX IF NOT EXISTS community_members_room_idx ON community_members(room_id);

-- ── 6. Reports (for moderation) ─────────────────────────────
CREATE TABLE IF NOT EXISTS community_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('post','comment')),
  reason      text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed')),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, target_id, target_type)  -- one report per user per item
);

CREATE INDEX IF NOT EXISTS community_reports_status_idx ON community_reports(status, created_at DESC);

-- ── 7. User ban list ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_bans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  banned_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── 8. Seed official rooms ──────────────────────────────────
INSERT INTO community_rooms (name, slug, description, category, icon, is_official) VALUES
  ('General Discussion',      'general',          'Open conversation about faith, life, and Scripture.', 'General',      '💬', true),
  ('Prayer Requests',         'prayer',           'Share your prayer requests and pray for one another.', 'General',      '🙏', true),
  ('Genesis',                 'genesis',          'Discuss the book of beginnings — creation, the patriarchs, and more.', 'Old Testament', '🌍', true),
  ('Psalms',                  'psalms',           'Explore the poetry, praise, and prayers of the Psalms.', 'Old Testament', '🎵', true),
  ('Proverbs',                'proverbs',         'Wisdom for everyday life from the book of Proverbs.', 'Old Testament', '💡', true),
  ('Isaiah',                  'isaiah',           'Deep dive into the prophetic book of Isaiah.', 'Old Testament', '📜', true),
  ('The Gospels',             'gospels',          'Matthew, Mark, Luke, and John — the life and teachings of Jesus.', 'New Testament', '✝️', true),
  ('Acts of the Apostles',    'acts',             'The early church, the Holy Spirit, and the spread of the Gospel.', 'New Testament', '🔥', true),
  ('Romans',                  'romans',           'Paul''s masterwork on salvation, grace, and the Gospel.', 'New Testament', '📖', true),
  ('Revelation',              'revelation',       'Study the last book of the Bible — prophecy, visions, and hope.', 'New Testament', '👁️', true),
  ('Bible Study Methods',     'study-methods',    'Tips, tools, and techniques for deep Bible study.', 'Study',        '🔍', true),
  ('Theology & Doctrine',     'theology',         'Discuss foundational Christian doctrines and theology.', 'Study',        '⛪', true),
  ('Faith & Everyday Life',   'faith-life',       'How does your faith shape your daily choices? Share here.', 'Life',         '🌿', true),
  ('Youth & Family',          'youth-family',     'Resources and discussion for raising children in the faith.', 'Life',         '👨‍👩‍👧', true),
  ('Apologetics',             'apologetics',      'Defending the faith with reason, evidence, and grace.', 'Study',        '🛡️', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Enable Row Level Security
-- ============================================================

ALTER TABLE community_rooms    ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_votes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_bans     ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ────────────────────────────────────────────

-- Rooms: anyone can read
CREATE POLICY "rooms_read_all"    ON community_rooms FOR SELECT USING (true);
CREATE POLICY "rooms_insert_auth" ON community_rooms FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Only admin (service role) can update/delete rooms

-- Posts: anyone can read non-removed; auth users can insert; owners can update their own
CREATE POLICY "posts_read_visible" ON community_posts FOR SELECT
  USING (is_removed = false OR auth.uid() = user_id);
CREATE POLICY "posts_insert_auth"  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "posts_update_own"   ON community_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments: same pattern
CREATE POLICY "comments_read_visible" ON community_comments FOR SELECT
  USING (is_removed = false OR auth.uid() = user_id);
CREATE POLICY "comments_insert_auth"  ON community_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "comments_update_own"   ON community_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Votes: auth users can manage their own
CREATE POLICY "votes_read_all"   ON community_votes FOR SELECT USING (true);
CREATE POLICY "votes_insert_own" ON community_votes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "votes_delete_own" ON community_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Members: anyone can read; auth can insert/delete their own
CREATE POLICY "members_read_all"    ON community_members FOR SELECT USING (true);
CREATE POLICY "members_insert_own"  ON community_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "members_delete_own"  ON community_members FOR DELETE
  USING (auth.uid() = user_id);

-- Reports: auth can insert own; only service role reads
CREATE POLICY "reports_insert_own" ON community_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = reporter_id);

-- Bans: service role only (no user-level policies needed)
