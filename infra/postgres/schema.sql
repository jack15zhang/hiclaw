CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE auth_provider AS ENUM ('phone', 'google', 'facebook');
CREATE TYPE carpool_type AS ENUM ('offer', 'request');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'confirmed', 'completed', 'cancelled', 'hidden');
CREATE TYPE transaction_type AS ENUM ('carpool', 'marketplace');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'tool');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE,
  google_id TEXT UNIQUE,
  facebook_id TEXT UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'hiclaw member',
  avatar_url TEXT,
  trust_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider auth_provider NOT NULL,
  provider_subject TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subject)
);

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  city TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  interests JSONB NOT NULL DEFAULT '[]',
  hidden_features_unlocked JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE approximate_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  area_label TEXT NOT NULL,
  geohash TEXT NOT NULL,
  geography GEOGRAPHY(POINT, 4326),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX approximate_locations_geography_idx ON approximate_locations USING GIST (geography);
CREATE INDEX approximate_locations_geohash_idx ON approximate_locations (geohash);

CREATE TABLE carpool_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type carpool_type NOT NULL,
  from_area TEXT NOT NULL,
  to_area TEXT NOT NULL,
  from_geohash TEXT NOT NULL,
  to_geohash TEXT NOT NULL,
  from_geography GEOGRAPHY(POINT, 4326),
  to_geography GEOGRAPHY(POINT, 4326),
  departure_time TIMESTAMPTZ NOT NULL,
  seats INTEGER NOT NULL CHECK (seats > 0),
  price TEXT NOT NULL,
  status listing_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX carpool_posts_from_geography_idx ON carpool_posts USING GIST (from_geography);
CREATE INDEX carpool_posts_to_geography_idx ON carpool_posts USING GIST (to_geography);
CREATE INDEX carpool_posts_status_departure_idx ON carpool_posts (status, departure_time);

CREATE TABLE carpool_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES carpool_posts(id) ON DELETE CASCADE,
  matched_post_id UUID NOT NULL REFERENCES carpool_posts(id) ON DELETE CASCADE,
  score NUMERIC(5, 2) NOT NULL,
  status listing_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, matched_post_id)
);

CREATE TABLE marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'CAD',
  condition TEXT NOT NULL,
  image_urls JSONB NOT NULL DEFAULT '[]',
  area_label TEXT NOT NULL,
  geohash TEXT NOT NULL,
  geography GEOGRAPHY(POINT, 4326),
  status listing_status NOT NULL DEFAULT 'active',
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX marketplace_items_geography_idx ON marketplace_items USING GIST (geography);
CREATE INDEX marketplace_items_status_category_idx ON marketplace_items (status, category);
CREATE INDEX marketplace_items_search_idx ON marketplace_items USING GIN (search_vector);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type transaction_type NOT NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  marketplace_item_id UUID REFERENCES marketplace_items(id) ON DELETE SET NULL,
  carpool_post_id UUID REFERENCES carpool_posts(id) ON DELETE SET NULL,
  status listing_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_session_created_idx ON chat_messages (session_id, created_at);

CREATE TABLE feature_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT NOT NULL,
  UNIQUE (user_id, feature_key)
);

CREATE TABLE trust_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_key TEXT NOT NULL,
  score_delta INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX trust_events_user_created_idx ON trust_events (user_id, created_at);
