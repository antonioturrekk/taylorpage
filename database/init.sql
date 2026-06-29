-- =====================================================
-- THE SWIFTIES NETWORK — Database Schema
-- PostgreSQL — Acessível via DBeaver
-- =====================================================

-- Limpa tabelas existentes (em ordem de dependência)
DROP TABLE IF EXISTS playlist_tracks CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- TABELA: users
-- Usuários da rede social (fãs e administradores)
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT DEFAULT '',
    favorite_era VARCHAR(100) DEFAULT '',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: artists
-- Artistas da plataforma (Taylor Swift + futuros)
-- =====================================================
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    cover_url VARCHAR(500),
    genre VARCHAR(100),
    spotify_url VARCHAR(500),
    instagram_url VARCHAR(500),
    twitter_url VARCHAR(500),
    monthly_listeners VARCHAR(50),
    total_albums INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: albums
-- Álbuns/Eras dos artistas
-- =====================================================
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    year INTEGER,
    release_date DATE,
    genre VARCHAR(100),
    sub_genre VARCHAR(100),
    color_hex VARCHAR(7) DEFAULT '#d4af37',
    color_dark VARCHAR(7) DEFAULT '#000000',
    image_url VARCHAR(500),
    description TEXT,
    track_count INTEGER DEFAULT 0,
    fun_fact TEXT,
    duration_minutes INTEGER,
    is_taylors_version BOOLEAN DEFAULT FALSE,
    original_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: tracks
-- Faixas individuais de cada álbum
-- =====================================================
CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    track_number INTEGER,
    duration_seconds INTEGER DEFAULT 0,
    lyrics_snippet TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_single BOOLEAN DEFAULT FALSE,
    featuring VARCHAR(200),
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: posts
-- Posts do mural da rede social
-- =====================================================
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    guest_name VARCHAR(100),
    content TEXT NOT NULL,
    era_tag VARCHAR(100),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: post_likes
-- Curtidas nos posts
-- =====================================================
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- =====================================================
-- TABELA: comments
-- Comentários nos posts
-- =====================================================
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: user_favorites
-- Músicas favoritas dos usuários
-- =====================================================
CREATE TABLE user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, track_id)
);

-- =====================================================
-- TABELA: playlists
-- Playlists criadas pelos usuários
-- =====================================================
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA: playlist_tracks
-- Faixas dentro de playlists
-- =====================================================
CREATE TABLE playlist_tracks (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, track_id)
);

-- =====================================================
-- ÍNDICES para performance nas buscas (DBeaver)
-- =====================================================
CREATE INDEX idx_albums_artist ON albums(artist_id);
CREATE INDEX idx_tracks_album ON tracks(album_id);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
CREATE INDEX idx_tracks_title ON tracks(title);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- =====================================================
-- VIEWS úteis para consultas no DBeaver
-- =====================================================

-- View: Todas as músicas com nome do álbum e artista
CREATE OR REPLACE VIEW vw_tracks_full AS
SELECT
    t.id AS track_id,
    t.title AS track_title,
    t.track_number,
    t.duration_seconds,
    t.is_popular,
    t.is_single,
    t.featuring,
    t.play_count,
    a.title AS album_title,
    a.year AS album_year,
    a.genre AS album_genre,
    a.color_hex,
    a.image_url AS album_image,
    ar.name AS artist_name
FROM tracks t
JOIN albums a ON t.album_id = a.id
JOIN artists ar ON a.artist_id = ar.id
ORDER BY a.year, t.track_number;

-- View: Estatísticas gerais da plataforma
CREATE OR REPLACE VIEW vw_platform_stats AS
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins,
    (SELECT COUNT(*) FROM artists) AS total_artists,
    (SELECT COUNT(*) FROM albums) AS total_albums,
    (SELECT COUNT(*) FROM tracks) AS total_tracks,
    (SELECT COUNT(*) FROM posts) AS total_posts,
    (SELECT COUNT(*) FROM comments) AS total_comments,
    (SELECT COUNT(*) FROM post_likes) AS total_likes,
    (SELECT COUNT(*) FROM playlists) AS total_playlists;

-- View: Posts com informação do usuário
CREATE OR REPLACE VIEW vw_posts_with_users AS
SELECT
    p.id AS post_id,
    p.content,
    p.era_tag,
    p.likes_count,
    p.comments_count,
    p.is_pinned,
    p.is_visible,
    p.created_at,
    COALESCE(u.username, p.guest_name, 'Anônimo') AS author_name,
    u.avatar_url,
    u.favorite_era AS author_era,
    u.role AS author_role
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.is_pinned DESC, p.created_at DESC;
