/* =====================================================
   THE SWIFTIES NETWORK — Express Server
   Backend completo com API REST + PostgreSQL
   ===================================================== */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// =====================================================
// AUTH MIDDLEWARE
// =====================================================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
}

// =====================================================
// AUTH ROUTES
// =====================================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, favorite_era, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email e senha são obrigatórios' });
    }

    // Check if user exists
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email ou username já cadastrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, favorite_era, bio)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, favorite_era, bio, created_at`,
      [username, email, password_hash, favorite_era || '', bio || '']
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorite_era: user.favorite_era,
        bio: user.bio,
        created_at: user.created_at
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, role, favorite_era, bio, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// =====================================================
// ARTISTS ROUTES
// =====================================================

// GET /api/artists
app.get('/api/artists', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM artists ORDER BY is_featured DESC, name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar artistas' });
  }
});

// GET /api/artists/:id
app.get('/api/artists/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM artists WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Artista não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar artista' });
  }
});

// GET /api/artists/:id/albums
app.get('/api/artists/:id/albums', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM albums WHERE artist_id = $1 ORDER BY year',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar álbuns' });
  }
});

// =====================================================
// ALBUMS ROUTES
// =====================================================

// GET /api/albums
app.get('/api/albums', async (req, res) => {
  try {
    const { artist_id, genre } = req.query;
    let query = 'SELECT a.*, ar.name as artist_name FROM albums a JOIN artists ar ON a.artist_id = ar.id';
    const params = [];
    const conditions = [];

    if (artist_id) {
      params.push(artist_id);
      conditions.push(`a.artist_id = $${params.length}`);
    }
    if (genre) {
      params.push(genre);
      conditions.push(`(a.genre = $${params.length} OR a.sub_genre ILIKE '%' || $${params.length} || '%')`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY a.year';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar álbuns' });
  }
});

// GET /api/albums/:id
app.get('/api/albums/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, ar.name as artist_name FROM albums a
       JOIN artists ar ON a.artist_id = ar.id WHERE a.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Álbum não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar álbum' });
  }
});

// GET /api/albums/:id/tracks
app.get('/api/albums/:id/tracks', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tracks WHERE album_id = $1 ORDER BY track_number',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar faixas' });
  }
});

// =====================================================
// TRACKS ROUTES
// =====================================================

// GET /api/tracks/search
app.get('/api/tracks/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const result = await db.query(
      `SELECT t.*, a.title as album_title, a.image_url as album_image, a.color_hex,
              ar.name as artist_name
       FROM tracks t
       JOIN albums a ON t.album_id = a.id
       JOIN artists ar ON a.artist_id = ar.id
       WHERE t.title ILIKE $1 OR a.title ILIKE $1 OR ar.name ILIKE $1
       ORDER BY t.is_popular DESC, t.title
       LIMIT 30`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca' });
  }
});

// GET /api/tracks/popular
app.get('/api/tracks/popular', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, a.title as album_title, a.image_url as album_image, a.color_hex, a.year as album_year,
              ar.name as artist_name
       FROM tracks t
       JOIN albums a ON t.album_id = a.id
       JOIN artists ar ON a.artist_id = ar.id
       WHERE t.is_popular = TRUE
       ORDER BY a.year DESC, t.track_number
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar faixas populares' });
  }
});

// POST /api/tracks/:id/play (increment play count)
app.post('/api/tracks/:id/play', async (req, res) => {
  try {
    await db.query('UPDATE tracks SET play_count = play_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar play' });
  }
});

// =====================================================
// POSTS ROUTES
// =====================================================

// GET /api/posts
app.get('/api/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT p.*, COALESCE(u.username, p.guest_name, 'Anônimo') as author_name,
              u.avatar_url, u.favorite_era as author_era, u.role as author_role
       FROM posts p LEFT JOIN users u ON p.user_id = u.id
       WHERE p.is_visible = TRUE
       ORDER BY p.is_pinned DESC, p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await db.query('SELECT COUNT(*) FROM posts WHERE is_visible = TRUE');
    const total = parseInt(countResult.rows[0].count);

    res.json({ posts: result.rows, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

// POST /api/posts (authenticated or guest)
app.post('/api/posts', async (req, res) => {
  try {
    const { content, era_tag, guest_name } = req.body;
    if (!content) return res.status(400).json({ error: 'Conteúdo é obrigatório' });

    // Check for auth token
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (e) { /* guest post */ }
    }

    const result = await db.query(
      `INSERT INTO posts (user_id, guest_name, content, era_tag)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, userId ? null : (guest_name || 'Swiftie Anônima'), content, era_tag || null]
    );

    // Fetch with user info
    const post = await db.query(
      `SELECT p.*, COALESCE(u.username, p.guest_name, 'Anônimo') as author_name,
              u.avatar_url, u.favorite_era as author_era
       FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(post.rows[0]);
  } catch (err) {
    console.error('Post error:', err);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

// POST /api/posts/:id/like
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    // Increment likes count (works for both guest and authenticated)
    await db.query(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
      [req.params.id]
    );

    const result = await db.query('SELECT likes_count FROM posts WHERE id = $1', [req.params.id]);
    res.json({ likes: result.rows[0]?.likes_count || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao curtir post' });
  }
});

// POST /api/posts/:id/comments
app.post('/api/posts/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Conteúdo obrigatório' });

    const result = await db.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, req.user.id, content]
    );

    await db.query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
      [req.params.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao comentar' });
  }
});

// GET /api/posts/:id/comments
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.username, u.avatar_url FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1 ORDER BY c.created_at`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

// =====================================================
// FAVORITES ROUTES
// =====================================================

// GET /api/favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT uf.*, t.title, t.track_number, t.duration_seconds,
              a.title as album_title, a.image_url as album_image, a.color_hex,
              ar.name as artist_name
       FROM user_favorites uf
       JOIN tracks t ON uf.track_id = t.id
       JOIN albums a ON t.album_id = a.id
       JOIN artists ar ON a.artist_id = ar.id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
});

// POST /api/favorites/:trackId
app.post('/api/favorites/:trackId', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO user_favorites (user_id, track_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.trackId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao favoritar' });
  }
});

// DELETE /api/favorites/:trackId
app.delete('/api/favorites/:trackId', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM user_favorites WHERE user_id = $1 AND track_id = $2',
      [req.user.id, req.params.trackId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover favorito' });
  }
});

// =====================================================
// ADMIN ROUTES
// =====================================================

// GET /api/admin/stats
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vw_platform_stats');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// GET /api/admin/users
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, role, favorite_era, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// DELETE /api/admin/posts/:id
app.delete('/api/admin/posts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE posts SET is_visible = FALSE WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ocultar post' });
  }
});

// POST /api/admin/artists
app.post('/api/admin/artists', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, bio, image_url, genre, spotify_url, instagram_url, twitter_url, monthly_listeners } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

    const result = await db.query(
      `INSERT INTO artists (name, bio, image_url, genre, spotify_url, instagram_url, twitter_url, monthly_listeners, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE) RETURNING *`,
      [name, bio, image_url, genre, spotify_url, instagram_url, twitter_url, monthly_listeners]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar artista' });
  }
});

// POST /api/admin/albums
app.post('/api/admin/albums', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { artist_id, title, year, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact } = req.body;
    if (!artist_id || !title) return res.status(400).json({ error: 'Artista e título são obrigatórios' });

    const result = await db.query(
      `INSERT INTO albums (artist_id, title, year, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [artist_id, title, year, genre, sub_genre, color_hex || '#d4af37', color_dark || '#000', image_url, description, track_count || 0, fun_fact]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar álbum' });
  }
});

// POST /api/admin/tracks
app.post('/api/admin/tracks', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { album_id, title, track_number, duration_seconds, is_popular, is_single, featuring } = req.body;
    if (!album_id || !title) return res.status(400).json({ error: 'Álbum e título são obrigatórios' });

    const result = await db.query(
      `INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [album_id, title, track_number || 1, duration_seconds || 0, is_popular || false, is_single || false, featuring]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar faixa' });
  }
});

// DELETE /api/admin/users/:id (deactivate)
app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'Você não pode desativar sua própria conta' });
    }
    await db.query('UPDATE users SET is_active = FALSE WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao desativar usuário' });
  }
});

// =====================================================
// SERVE FRONTEND
// =====================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`\n✦ The Swifties Network Server ✦`);
  console.log(`🚀 Rodando em http://localhost:${PORT}`);
  console.log(`📦 Banco: ${process.env.DATABASE_URL ? 'PostgreSQL conectado' : '⚠️ DATABASE_URL não configurado'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Configurado' : '⚠️ Não configurado'}`);
  console.log('');
});
