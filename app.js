/* =====================================================
   THE SWIFTIES NETWORK — app.js
   Lógica Full-Stack: Auth, Player, Admin, etc.
   ===================================================== */

// ===== STATE & API =====
const API_URL = '/api';

const state = {
    user: null,
    token: localStorage.getItem('tsn_token'),
    albums: [],
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    favorites: new Set()
};

// API Client Helper
const api = {
    async request(endpoint, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
        
        try {
            const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro na requisição');
            return data;
        } catch (err) {
            showToast(err.message);
            throw err;
        }
    },
    get: (endpoint) => api.request(endpoint),
    post: (endpoint, body) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    delete: (endpoint) => api.request(endpoint, { method: 'DELETE' })
};

// ===== AUTH MANAGER =====
const AuthManager = {
    async init() {
        if (state.token) {
            try {
                const user = await api.get('/auth/me');
                this.setUser(user);
            } catch (err) {
                this.logout();
            }
        }
    },

    setUser(user) {
        state.user = user;
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-menu').style.display = 'flex';
        document.getElementById('dropdown-username').textContent = user.username;
        document.getElementById('dropdown-era').textContent = user.favorite_era;
        document.getElementById('user-name-badge').textContent = user.username;
        document.getElementById('user-avatar-badge').textContent = user.username.charAt(0).toUpperCase();

        if (user.role === 'admin') {
            document.getElementById('nav-admin-link').style.display = 'block';
            document.getElementById('dropdown-admin-link').style.display = 'block';
        }

        // Load favorites
        PlayerManager.loadFavorites();
        closeAuthModal();
        showToast(`Bem-vinda de volta, ${user.username}! 💕`);
    },

    logout() {
        state.user = null;
        state.token = null;
        localStorage.removeItem('tsn_token');
        document.getElementById('auth-buttons').style.display = 'flex';
        document.getElementById('user-menu').style.display = 'none';
        document.getElementById('nav-admin-link').style.display = 'none';
        document.getElementById('dropdown-admin-link').style.display = 'none';
        state.favorites.clear();
        showToast('Você saiu da conta.');
        if (document.getElementById('admin').classList.contains('active')) goTo('home');
    },

    async login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errEl = document.getElementById('login-error');
        errEl.textContent = '';

        try {
            const data = await api.post('/auth/login', { email, password });
            state.token = data.token;
            localStorage.setItem('tsn_token', data.token);
            this.setUser(data.user);
        } catch (err) {
            errEl.textContent = err.message;
        }
    },

    async register() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const favorite_era = document.getElementById('register-era').value;
        const bio = document.getElementById('register-bio').value;
        const errEl = document.getElementById('register-error');
        errEl.textContent = '';

        try {
            const data = await api.post('/auth/register', { username, email, password, favorite_era, bio });
            state.token = data.token;
            localStorage.setItem('tsn_token', data.token);
            this.setUser(data.user);
        } catch (err) {
            errEl.textContent = err.message;
        }
    }
};

// Auth UI Helpers
window.openAuthModal = (type = 'login') => {
    document.getElementById('auth-modal').classList.add('open');
    switchAuthForm(type);
};
window.closeAuthModal = () => document.getElementById('auth-modal').classList.remove('open');
window.switchAuthForm = (type) => {
    document.getElementById('auth-login-form').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('auth-register-form').style.display = type === 'register' ? 'block' : 'none';
};
window.logout = () => AuthManager.logout();
window.toggleUserDropdown = () => document.getElementById('user-dropdown').classList.toggle('show');

document.addEventListener('click', (e) => {
    if (!e.target.closest('#user-menu')) {
        document.getElementById('user-dropdown')?.classList.remove('show');
    }
});

// ===== PLAYER MANAGER =====
const audioEl = document.getElementById('bg-audio');

const PlayerManager = {
    async init() {
        await this.loadAlbums();
        await this.loadPopularTracks();
        this.setupAudioListeners();
    },

    async loadAlbums() {
        try {
            state.albums = await api.get('/albums');
            this.renderAlbumsList();
            this.renderErasGrid(); // Repopulate Eras section
        } catch (e) { console.error('Error loading albums'); }
    },

    async loadPopularTracks() {
        try {
            state.tracks = await api.get('/tracks/popular');
            this.renderTracklist('Músicas Populares');
            if (state.tracks.length > 0 && !state.currentTrack) {
                this.setTrackInfo(state.tracks[0]);
            }
        } catch (e) { console.error('Error loading popular tracks'); }
    },

    async loadFavorites() {
        if (!state.user) return;
        try {
            const favs = await api.get('/favorites');
            state.favorites = new Set(favs.map(f => f.track_id));
            this.renderTracklist(); // Re-render to show hearts
        } catch (e) { console.error('Error loading favorites'); }
    },

    async loadAlbumTracks(albumId, albumTitle) {
        try {
            document.getElementById('player-tracklist').innerHTML = '<div class="loading-spinner"></div>';
            state.tracks = await api.get(`/albums/${albumId}/tracks`);
            
            // Add album info to tracks for the player
            const album = state.albums.find(a => a.id === parseInt(albumId));
            state.tracks.forEach(t => {
                t.album_title = album.title;
                t.album_image = album.image_url;
                t.color_hex = album.color_hex;
                t.artist_name = album.artist_name;
            });
            
            this.renderTracklist(albumTitle);
        } catch (e) { console.error('Error loading album tracks'); }
    },

    async toggleFavorite() {
        if (!state.user) {
            openAuthModal('login');
            return showToast('Faça login para favoritar músicas!');
        }
        if (!state.currentTrack) return;

        const trackId = state.currentTrack.id;
        const btnNp = document.getElementById('btn-fav-track');
        const btnMini = document.querySelector('.btn-fav-mini');
        
        try {
            if (state.favorites.has(trackId)) {
                await api.delete(`/favorites/${trackId}`);
                state.favorites.delete(trackId);
                btnNp.classList.remove('active');
                btnMini.classList.remove('active');
                showToast('Removido dos favoritos');
            } else {
                await api.post(`/favorites/${trackId}`);
                state.favorites.add(trackId);
                btnNp.classList.add('active');
                btnMini.classList.add('active');
                showToast('Adicionado aos favoritos! 💕');
            }
            this.renderTracklist(); // Update hearts in list
        } catch (e) { console.error('Error toggling favorite'); }
    },

    playTrack(index) {
        const track = state.tracks[index];
        if (!track) return;
        
        this.setTrackInfo(track);
        
        // In a real app, we would set audioEl.src = track.audio_url
        // Since we don't have all MP3s, we just play the single track we have and restart it
        audioEl.currentTime = 0;
        audioEl.play().catch(e => console.log('Autoplay blocked'));
        
        this.updatePlayState(true);
        this.renderTracklist(); // Update playing indicator in list
        
        // Increment play count (fire and forget)
        api.post(`/tracks/${track.id}/play`).catch(e=>{});
    },

    setTrackInfo(track) {
        state.currentTrack = track;
        
        // UI Updates - Now Playing Hero
        document.getElementById('now-playing-title').textContent = track.title;
        document.getElementById('now-playing-album').textContent = track.album_title;
        document.getElementById('now-playing-artist').textContent = track.artist_name;
        document.getElementById('now-playing-img').src = track.album_image;
        document.getElementById('now-playing-bg').style.backgroundColor = track.color_hex || '#0d0d14';
        
        // UI Updates - Bottom Bar
        document.getElementById('audio-track-name').textContent = track.title;
        document.getElementById('audio-artist-name').textContent = track.artist_name;
        document.getElementById('audio-cover-img').src = track.album_image;
        
        // Update Favorite state
        const isFav = state.favorites.has(track.id);
        document.getElementById('btn-fav-track').classList.toggle('active', isFav);
        document.querySelector('.btn-fav-mini').classList.toggle('active', isFav);
    },

    togglePlay() {
        if (audioEl.paused) {
            audioEl.play();
            this.updatePlayState(true);
        } else {
            audioEl.pause();
            this.updatePlayState(false);
        }
    },

    updatePlayState(playing) {
        state.isPlaying = playing;
        const icon = playing ? '⏸' : '▶';
        document.getElementById('play-pause-btn').textContent = icon;
        document.getElementById('big-play-icon').textContent = icon;
        
        // Visual indicators
        document.getElementById('waveform').classList.toggle('playing', playing);
        const vinyl = document.querySelector('.vinyl-record');
        if (vinyl) vinyl.style.animationPlayState = playing ? 'running' : 'paused';
    },

    next() {
        if (!state.currentTrack || state.tracks.length === 0) return;
        let idx = state.tracks.findIndex(t => t.id === state.currentTrack.id);
        idx = (idx + 1) % state.tracks.length;
        this.playTrack(idx);
    },

    prev() {
        if (!state.currentTrack || state.tracks.length === 0) return;
        if (audioEl.currentTime > 3) {
            audioEl.currentTime = 0;
            return;
        }
        let idx = state.tracks.findIndex(t => t.id === state.currentTrack.id);
        idx = (idx - 1 + state.tracks.length) % state.tracks.length;
        this.playTrack(idx);
    },

    setupAudioListeners() {
        audioEl.addEventListener('timeupdate', () => {
            if (!audioEl.duration) return;
            const pct = (audioEl.currentTime / audioEl.duration) * 100;
            document.getElementById('audio-progress-bar').style.width = `${pct}%`;
            document.getElementById('audio-current-time').textContent = formatTime(audioEl.currentTime);
            document.getElementById('audio-total-time').textContent = formatTime(audioEl.duration);
        });
        audioEl.addEventListener('ended', () => this.next());
        audioEl.addEventListener('play', () => this.updatePlayState(true));
        audioEl.addEventListener('pause', () => this.updatePlayState(false));
    },

    renderAlbumsList() {
        const list = document.getElementById('player-albums-list');
        list.innerHTML = state.albums.map(album => `
            <div class="player-album-item" onclick="PlayerManager.loadAlbumTracks('${album.id}', '${album.title.replace(/'/g,"\\'")}')">
                <img src="${album.image_url}" alt="${album.title}" onerror="this.src='https://via.placeholder.com/40'">
                <div class="player-album-item-info">
                    <strong>${album.title}</strong>
                    <span>${album.year} • ${album.artist_name}</span>
                </div>
            </div>
        `).join('');
    },

    renderTracklist(title) {
        if (title) document.getElementById('tracklist-title').textContent = title;
        document.getElementById('tracklist-count').textContent = `${state.tracks.length} músicas`;
        
        const list = document.getElementById('player-tracklist');
        if (state.tracks.length === 0) {
            list.innerHTML = '<p style="color:#999;text-align:center;padding:20px">Nenhuma música encontrada.</p>';
            return;
        }

        list.innerHTML = state.tracks.map((track, i) => {
            const isPlaying = state.currentTrack && state.currentTrack.id === track.id;
            const isFav = state.favorites.has(track.id);
            return `
                <div class="track-item ${isPlaying ? 'playing' : ''}" onclick="PlayerManager.playTrack(${i})">
                    <div>
                        <span class="track-num">${i + 1}</span>
                        <span class="track-item-play">▶</span>
                    </div>
                    <div class="track-info">
                        <span class="track-title">${track.title} ${track.featuring ? `<span style="opacity:0.6;font-size:0.8em">(feat. ${track.featuring})</span>` : ''}</span>
                        <span class="track-artist">${track.artist_name}</span>
                    </div>
                    <div class="track-duration">${formatTime(track.duration_seconds || 200)}</div>
                    <button class="track-fav ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.favTrack(${track.id})">♡</button>
                </div>
            `;
        }).join('');
    },

    // Refreshes the Eras grid on the main page from DB
    renderErasGrid() {
        const grid = document.getElementById('eras-grid');
        if (!grid) return;
        
        grid.innerHTML = state.albums.map(album => {
            const genre = (album.sub_genre || album.genre || 'pop').toLowerCase();
            return `
                <div class="era-card" data-genre="${genre}" style="--era-color: ${album.color_hex}; --era-dark: ${album.color_dark || '#000'};" onclick="openEraModalDB(${album.id})">
                    <div class="era-year">${album.year}</div>
                    <div class="era-cover">
                        <img src="${album.image_url}" alt="${album.title}" onerror="this.src='https://via.placeholder.com/300x300/${album.color_hex.replace('#','')}/fff?text=Album'">
                        <div class="era-overlay"><span class="era-play">▶ Explorar</span></div>
                    </div>
                    <div class="era-info">
                        <h3>${album.title}</h3>
                        <p>${album.description || ''}</p>
                        <div class="era-tags">
                            <span class="tag">${album.genre}</span>
                            <span class="tag">${album.track_count} faixas</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};

window.PlayerManager = PlayerManager;
window.toggleAudio = () => PlayerManager.togglePlay();
window.seekAudio = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = pos * audioEl.duration;
};
window.setVolume = (val) => audioEl.volume = val;
window.toggleMute = () => {
    audioEl.muted = !audioEl.muted;
    document.querySelector('.volume-icon').textContent = audioEl.muted ? '🔇' : '🔊';
};
window.favTrack = async (id) => {
    if (!state.currentTrack || state.currentTrack.id !== id) {
        // If clicking heart on a track not playing, fake it for now or find it
        // Simpler implementation: just click it
        const track = state.tracks.find(t => t.id === id);
        if(track) {
            const oldCurrent = state.currentTrack;
            state.currentTrack = track;
            await PlayerManager.toggleFavorite();
            state.currentTrack = oldCurrent;
        }
    } else {
        await PlayerManager.toggleFavorite();
    }
};

function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

async function searchTracks(query) {
    if (query.length < 2) {
        document.getElementById('player-search-results').style.display = 'none';
        document.getElementById('player-tracklist').style.display = 'block';
        return;
    }
    
    try {
        const results = await api.get(`/tracks/search?q=${encodeURIComponent(query)}`);
        const resEl = document.getElementById('search-results-list');
        document.getElementById('player-search-results').style.display = 'block';
        document.getElementById('player-tracklist').style.display = 'none';
        
        if (results.length === 0) {
            resEl.innerHTML = '<p style="color:#999">Nenhuma música encontrada.</p>';
            return;
        }

        // Temporarily save to state.tracks so clicking plays them correctly
        const tempTracks = [...state.tracks];
        state.tracks = results;

        resEl.innerHTML = results.map((track, i) => `
            <div class="track-item" onclick="PlayerManager.playTrack(${i})">
                <img src="${track.album_image}" style="width:30px;height:30px;border-radius:4px" alt="cover">
                <div class="track-info">
                    <span class="track-title">${track.title}</span>
                    <span class="track-artist">${track.artist_name} • ${track.album_title}</span>
                </div>
            </div>
        `).join('');
        
    } catch (e) { console.error('Search error'); }
}
window.searchTracks = searchTracks;

// ===== ERA MODAL (DB VERSION) =====
window.openEraModalDB = async (albumId) => {
    const album = state.albums.find(a => a.id === albumId);
    if (!album) return;
    
    const modal = document.getElementById('era-modal');
    const inner = document.getElementById('era-modal-inner');
    inner.innerHTML = '<div class="loading-spinner"></div>';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
        const tracks = await api.get(`/albums/${albumId}/tracks`);
        
        inner.innerHTML = `
            <button onclick="closeEraModal()" style="position:absolute;top:16px;right:16px;background:transparent;border:1px solid rgba(255,255,255,0.1);color:#f0eade;width:32px;height:32px;border-radius:50%;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;">✕</button>
            <div style="border-top:3px solid ${album.color_hex};padding-top:24px;margin-bottom:24px;">
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:rgba(240,234,222,0.5);letter-spacing:2px;text-transform:uppercase;">${album.year} ${album.is_taylors_version ? "| Taylor's Version" : ""}</span>
                <h2 style="font-family:var(--font-display);font-size:2.2rem;color:#f0eade;margin:8px 0;font-weight:900;">${album.title}</h2>
                <p style="font-family:var(--font-body);color:rgba(240,234,222,0.7);font-size:1.1rem;line-height:1.6;">${album.description || ''}</p>
            </div>
            
            <button class="btn-primary" onclick="goTo('player'); PlayerManager.loadAlbumTracks(${album.id}, '${album.title.replace(/'/g,"\\'")}')" style="margin-bottom:20px">
                🎵 Ouvir no Player
            </button>

            <div style="margin-bottom:24px;">
                <h4 style="font-family:var(--font-mono);font-size:0.7rem;letter-spacing:2px;color:${album.color_hex};text-transform:uppercase;margin-bottom:12px;">✦ FAIXAS (${tracks.length})</h4>
                <div style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:10px">
                    ${tracks.map((t, i) => `
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <span style="font-family:var(--font-mono);font-size:0.65rem;color:rgba(240,234,222,0.3);width:20px;">${String(t.track_number).padStart(2,'0')}</span>
                                <span style="font-family:var(--font-body);color:#f0eade;font-size:1rem;">${t.title} ${t.featuring ? `<span style="font-size:0.8em;opacity:0.6">(feat. ${t.featuring})</span>`:''}</span>
                            </div>
                            <span style="font-family:var(--font-mono);font-size:0.7rem;color:rgba(255,255,255,0.3)">${formatTime(t.duration_seconds)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${album.fun_fact ? `
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;">
                <h4 style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:2px;color:${album.color_hex};text-transform:uppercase;margin-bottom:8px;">✦ VOCÊ SABIA?</h4>
                <p style="font-family:var(--font-body);color:rgba(240,234,222,0.8);font-size:1rem;line-height:1.5;">${album.fun_fact}</p>
            </div>
            ` : ''}
        `;
    } catch (e) {
        inner.innerHTML = '<p>Erro ao carregar dados do álbum.</p>';
    }
};

window.closeEraModal = (e) => {
    if (e && e.target !== document.getElementById('era-modal') && !e.target.classList.contains('era-modal')) return;
    document.getElementById('era-modal').classList.remove('open');
    document.body.style.overflow = 'auto';
};


// ===== ADMIN MANAGER =====
const AdminManager = {
    async loadStats() {
        if (!state.user || state.user.role !== 'admin') return;
        try {
            const stats = await api.get('/admin/stats');
            document.getElementById('admin-total-users').textContent = stats.total_users;
            document.getElementById('admin-total-artists').textContent = stats.total_artists;
            document.getElementById('admin-total-albums').textContent = stats.total_albums;
            document.getElementById('admin-total-tracks').textContent = stats.total_tracks;
            document.getElementById('admin-total-posts').textContent = stats.total_posts;
            document.getElementById('admin-total-likes').textContent = stats.total_likes;
        } catch (e) { console.error('Error loading stats'); }
    },

    async loadUsers() {
        if (!state.user || state.user.role !== 'admin') return;
        try {
            const users = await api.get('/admin/users');
            const tbody = document.getElementById('admin-users-tbody');
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td><span style="color:${u.role==='admin'?'var(--gold)':'white'}">${u.role}</span></td>
                    <td>${u.favorite_era}</td>
                    <td>${new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                        ${u.id !== state.user.id ? `<button class="btn-danger" onclick="AdminManager.deleteUser(${u.id})">Desativar</button>` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (e) { console.error('Error loading users'); }
    },

    async loadPosts() {
        if (!state.user || state.user.role !== 'admin') return;
        try {
            const data = await api.get('/posts?limit=50');
            const list = document.getElementById('admin-posts-list');
            list.innerHTML = data.posts.map(p => `
                <div class="admin-post-card">
                    <div class="admin-post-content">
                        <div class="admin-post-meta">
                            <strong>${p.author_name}</strong> • ${new Date(p.created_at).toLocaleString('pt-BR')} • 💕 ${p.likes_count}
                        </div>
                        <div class="admin-post-text">${p.content}</div>
                    </div>
                    <button class="btn-danger" onclick="AdminManager.deletePost(${p.id})">Deletar</button>
                </div>
            `).join('');
        } catch (e) { console.error('Error loading posts admin'); }
    },

    async deletePost(id) {
        if (!confirm('Deletar post?')) return;
        try {
            await api.delete(`/admin/posts/${id}`);
            showToast('Post ocultado com sucesso');
            this.loadPosts();
        } catch (e) { }
    },

    async deleteUser(id) {
        if (!confirm('Desativar usuário?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            showToast('Usuário desativado');
            this.loadUsers();
        } catch (e) { }
    },
    
    populateSelects() {
        // Populate album form artist select
        api.get('/artists').then(artists => {
            const select = document.getElementById('new-album-artist');
            if(select) select.innerHTML = '<option value="">Selecione o artista...</option>' + 
                artists.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
        });
        
        // Populate track form album select
        if(state.albums.length > 0) {
            const select = document.getElementById('new-track-album');
            if(select) select.innerHTML = '<option value="">Selecione o álbum...</option>' + 
                state.albums.map(a => `<option value="${a.id}">${a.title} (${a.artist_name})</option>`).join('');
        }
    },

    async addArtist() {
        const payload = {
            name: document.getElementById('new-artist-name').value,
            bio: document.getElementById('new-artist-bio').value,
            genre: document.getElementById('new-artist-genre').value,
            image_url: document.getElementById('new-artist-image').value,
            spotify_url: document.getElementById('new-artist-spotify').value,
            instagram_url: document.getElementById('new-artist-instagram').value,
        };
        try {
            await api.post('/admin/artists', payload);
            showToast('Artista adicionado com sucesso!');
            document.querySelectorAll('#admin-add-artist input, #admin-add-artist textarea').forEach(i => i.value='');
            this.populateSelects();
        } catch (e) {}
    },

    async addAlbum() {
        const payload = {
            artist_id: document.getElementById('new-album-artist').value,
            title: document.getElementById('new-album-title').value,
            year: document.getElementById('new-album-year').value,
            genre: document.getElementById('new-album-genre').value,
            color_hex: document.getElementById('new-album-color').value,
            description: document.getElementById('new-album-desc').value,
            image_url: document.getElementById('new-album-image').value,
            track_count: document.getElementById('new-album-tracks').value,
            fun_fact: document.getElementById('new-album-fun').value,
        };
        try {
            await api.post('/admin/albums', payload);
            showToast('Álbum adicionado com sucesso!');
            document.querySelectorAll('#admin-add-album input:not([type=color]), #admin-add-album textarea').forEach(i => i.value='');
            PlayerManager.loadAlbums(); // refresh globally
            this.populateSelects();
        } catch (e) {}
    },

    async addTrack() {
        const payload = {
            album_id: document.getElementById('new-track-album').value,
            title: document.getElementById('new-track-title').value,
            track_number: document.getElementById('new-track-number').value,
            duration_seconds: document.getElementById('new-track-duration').value,
            featuring: document.getElementById('new-track-feat').value,
            is_popular: document.getElementById('new-track-popular').checked,
            is_single: document.getElementById('new-track-single').checked,
        };
        try {
            await api.post('/admin/tracks', payload);
            showToast('Faixa adicionada com sucesso!');
            document.getElementById('new-track-title').value = '';
            document.getElementById('new-track-number').value = parseInt(payload.track_number) + 1;
        } catch (e) {}
    }
};
window.AdminManager = AdminManager;

window.switchAdminTab = (tabId, btn) => {
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
    document.getElementById(`admin-${tabId}`).style.display = 'block';
    
    if (tabId === 'users') AdminManager.loadUsers();
    if (tabId === 'posts') AdminManager.loadPosts();
    if (tabId.startsWith('add')) AdminManager.populateSelects();
};

// ===== NAVEGAÇÃO & UI BÁSICA =====

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.7)');
document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');

function setupCursorHovers() {
    document.querySelectorAll('a, button, .era-card, .gal-item, .foto-item, .track-item, .player-album-item, .user-badge').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '48px';
            cursor.style.height = '48px';
            cursor.style.borderColor = '#d4af37';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '32px';
            cursor.style.height = '32px';
            cursor.style.borderColor = '#d4af37';
        });
    });
}

window.enterSite = function() {
    document.getElementById('splash').classList.add('hidden');
    document.body.style.overflow = 'auto';
    audioEl.volume = 0.4;
    audioEl.play().catch(()=>{});
    PlayerManager.updatePlayState(true);
}

window.goTo = function(tab) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(tab);
    if (target) target.classList.add('active');
    const activeLink = document.querySelector(`[data-tab="${tab}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobile();
    
    if (tab === 'admin') {
        AdminManager.loadStats();
        AdminManager.loadUsers();
    }
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(link.dataset.tab);
    });
});

window.toggleMobile = () => document.getElementById('mobile-menu').classList.toggle('open');
window.closeMobile = () => document.getElementById('mobile-menu').classList.remove('open');
window.showToast = (msg) => {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// Filter Gallery
window.filterGallery = (cat, btn) => {
    document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.gal-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) item.classList.remove('hidden');
        else item.classList.add('hidden');
    });
};

// Filter Eras
window.filterEra = (genre, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.era-card').forEach(card => {
        const cardGenre = card.dataset.genre || '';
        if (genre === 'all' || cardGenre.includes(genre)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
};

// Lightbox
window.openLightbox = (el) => {
    const img = el.querySelector('img');
    const caption = el.querySelector('.gal-overlay span');
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-caption').textContent = caption ? caption.textContent : '';
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
};
window.closeLightbox = () => {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = 'auto';
};

// Quizz
window.revealEra = (era) => {
    const eraData = {
        lover: { name: 'Lover Era 💕', color: '#ff9fb5' },
        midnights: { name: 'Midnights Era 🌙', color: '#1d2a44' },
        reputation: { name: 'Reputation Era 🐍', color: '#1a1a1a' },
        folklore: { name: 'Folklore Era 🌲', color: '#cfcfcf' },
        '1989': { name: '1989 Era ☁️', color: '#b1d4e0' },
        red: { name: 'Red Era ❤️', color: '#8b0000' }
    };
    const data = eraData[era];
    const result = document.getElementById('era-result');
    result.innerHTML = `<h3>${data.name}</h3><p>Descubra essa era na aba Eras!</p>`;
    result.style.borderColor = data.color;
    result.classList.remove('hidden');
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    // Auth
    await AuthManager.init();
    
    // Player & Data
    await PlayerManager.init();

    // Setup interactive elements
    setupCursorHovers();
    
    // Header scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.style.background = 'rgba(8, 8, 13, 0.97)';
        else header.style.background = 'rgba(13, 13, 20, 0.85)';
    });
});
