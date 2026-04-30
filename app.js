/* ===== THE SWIFTIES NETWORK - app.js ===== */

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
});
document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

document.querySelectorAll('a, button, .era-card, .gal-item, .foto-item').forEach(el => {
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

// ===== SPLASH SCREEN =====
function enterSite() {
    const splash = document.getElementById('splash');
    splash.classList.add('hidden');
    document.body.style.overflow = 'auto';

    // Tenta reproduzir o áudio quando o usuário clica
    const audio = document.getElementById('bg-audio');
    if (audio) {
        audio.volume = 0.4;
        audio.play().catch(() => {
            // autoplay bloqueado, sem problema
        });
    }
}

// ===== AUDIO =====
let isPlaying = true;

function toggleAudio() {
    const audio = document.getElementById('bg-audio');
    const btn = document.getElementById('play-pause-btn');
    const icon = document.querySelector('.audio-icon');
    const vinyl = document.querySelector('.vinyl-record');
    const vinylInner = document.querySelector('.vinyl-inner');

    if (audio.paused) {
        audio.play();
        isPlaying = true;
        if (btn) btn.textContent = '⏸';
        if (icon) icon.classList.remove('paused');
        if (vinyl) vinyl.style.animationPlayState = 'running';
        if (vinylInner) vinylInner.style.animationPlayState = 'running';
    } else {
        audio.pause();
        isPlaying = false;
        if (btn) btn.textContent = '▶';
        if (icon) icon.classList.add('paused');
        if (vinyl) vinyl.style.animationPlayState = 'paused';
        if (vinylInner) vinylInner.style.animationPlayState = 'paused';
    }
}

function setVolume(val) {
    const audio = document.getElementById('bg-audio');
    if (audio) audio.volume = parseFloat(val);
}

// Atualiza barra de progresso do áudio
const audio = document.getElementById('bg-audio');
if (audio) {
    audio.addEventListener('timeupdate', () => {
        const bar = document.getElementById('audio-progress-bar');
        if (bar && audio.duration) {
            bar.style.width = (audio.currentTime / audio.duration * 100) + '%';
        }
    });
}

// ===== NAVEGAÇÃO =====
function goTo(tab) {
    // Esconde todas as sections
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Mostra a section alvo
    const target = document.getElementById(tab);
    if (target) target.classList.add('active');

    // Atualiza nav link ativo
    const activeLink = document.querySelector(`[data-tab="${tab}"]`);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobile();
}

// Nav links por href
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        if (tab) goTo(tab);
    });
});

// ===== MOBILE MENU =====
function toggleMobile() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('open');
}

function closeMobile() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.remove('open');
}

// ===== ERA QUIZ =====
const eraData = {
    lover: {
        name: 'Lover Era 💕',
        desc: 'Você está no modo apaixonada! Tudo é rosa, azul pastel e cheio de esperança. Ouça: Lover, Paper Rings, Cruel Summer.',
        color: '#ff9fb5'
    },
    midnights: {
        name: 'Midnights Era 🌙',
        desc: 'Você está introspectiva e profunda. 3 da manhã pensamentos. Ouça: Anti-Hero, Labyrinth, Would\'ve Could\'ve Should\'ve.',
        color: '#1d2a44'
    },
    reputation: {
        name: 'Reputation Era 🐍',
        desc: 'A velha Taylor não pode atender o telefone. Você está no modo poderosa e intocável. Ouça: Look What You Made Me Do, Getaway Car, Delicate.',
        color: '#1a1a1a'
    },
    folklore: {
        name: 'Folklore Era 🌲',
        desc: 'Você está nostálgica e contemplativa. Histórias em tons cinzas. Ouça: Seven, This Is Me Trying, August.',
        color: '#cfcfcf'
    },
    '1989': {
        name: '1989 Era ☁️',
        desc: 'New York, Polaroids e hitss eternos. Você está brilhante e radiante! Ouça: Style, Clean, New Romantics.',
        color: '#b1d4e0'
    },
    red: {
        name: 'Red Era ❤️',
        desc: 'Amor que queima como fogo. Você está intensa e emotiva. Ouça: All Too Well, State of Grace, Holy Ground.',
        color: '#8b0000'
    }
};

function revealEra(era) {
    const data = eraData[era];
    const result = document.getElementById('era-result');
    result.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.desc}</p>
    `;
    result.style.borderColor = data.color;
    result.classList.remove('hidden');
}

// ===== GALLERY FILTER =====
function filterGallery(cat, btn) {
    document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.gal-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// ===== LIGHTBOX =====
function openLightbox(el) {
    const img = el.querySelector('img');
    const caption = el.querySelector('.gal-overlay span');
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-caption').textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeEraModal();
    }
});

// ===== ERA MODAL =====
const eraModalData = {
    fearless: {
        name: 'Fearless (Taylor\'s Version)',
        year: '2008 | 2021',
        color: '#ebb753',
        desc: 'O álbum que lançou Taylor ao estrelato global. Com um som country pop dourado, o disco captura a inocência e coragem de amar sendo jovem.',
        tracks: ['Love Story', 'You Belong With Me', 'Fearless', 'The Best Day', 'White Horse', 'Change', 'Jump Then Fall', 'Breathe', 'Hey Stephen', 'Tell Me Why'],
        fun: 'Fearless ganhou o Grammy de Álbum do Ano em 2010, tornando Taylor a mais jovem artista a vencer na categoria!'
    },
    speaknow: {
        name: 'Speak Now (Taylor\'s Version)',
        year: '2010 | 2023',
        color: '#a52a2a',
        desc: 'O único álbum escrito inteiramente por Taylor. Repleto de encantamento, romantismo e narrativas elaboradas que mostram seu talento de contar histórias.',
        tracks: ['Mine', 'Sparks Fly', 'Back To December', 'Speak Now', 'Dear John', 'Mean', 'The Story of Us', 'Never Grow Up', 'Enchanted', 'Better Than Revenge'],
        fun: 'Taylor escreveu Speak Now inteiramente sozinha para provar sua capacidade como compositora!'
    },
    red: {
        name: 'Red (Taylor\'s Version)',
        year: '2012 | 2021',
        color: '#8b0000',
        desc: 'O álbum mais emocional de Taylor. Uma mistura única de country, pop, rock e folk que captura todas as cores de um amor intenso e avassalador.',
        tracks: ['State of Grace', 'Red', 'Treacherous', 'I Knew You Were Trouble', '22', 'Everything Has Changed', 'We Are Never Ever Getting Back Together', 'Holy Ground', 'Sad Beautiful Tragic', 'All Too Well (10 Min Version)'],
        fun: 'All Too Well (10 Min Version) é a canção mais longa a chegar ao #1 na Billboard Hot 100!'
    },
    '1989': {
        name: '1989 (Taylor\'s Version)',
        year: '2014 | 2023',
        color: '#b1d4e0',
        desc: 'A transição definitiva para o pop. Inspirado nos anos 80, o álbum é uma explosão de synths, Polaroids e hits eternos gravados nas noites de Nova York.',
        tracks: ['Welcome to New York', 'Blank Space', 'Style', 'Out of the Woods', 'All You Had to Do Was Stay', 'Shake It Off', 'How You Get the Girl', 'Clean', 'New Romantics', 'Wonderland'],
        fun: '1989 foi o álbum mais vendido de 2014 globalmente, com mais de 10 milhões de cópias!'
    },
    reputation: {
        name: 'Reputation',
        year: '2017',
        color: '#1a1a1a',
        desc: 'A reinvenção sombria e poderosa. Após anos de controvérsias midiáticas, Taylor voltou com uma nova persona: mais dark, mais direta e com garras afiadas.',
        tracks: ['...Ready for It?', 'End Game', 'I Did Something Bad', 'Don\'t Blame Me', 'Delicate', 'Look What You Made Me Do', 'So It Goes...', 'Gorgeous', 'Getaway Car', 'New Year\'s Day'],
        fun: 'Reputation é o álbum mais vendido de 2017 nos EUA, com mais de 1.2 milhões de cópias na primeira semana!'
    },
    lover: {
        name: 'Lover',
        year: '2019',
        color: '#ff9fb5',
        desc: 'A declaração de amor mais colorida de Taylor. Com paleta pastel de rosas e azuis, Lover é puro e alegre, capturando o sentimento de amor em sua forma mais doce.',
        tracks: ['I Forgot That You Existed', 'Cruel Summer', 'Lover', 'The Man', 'The Archer', 'I Think He Knows', 'Miss Americana & the Heartbreak Prince', 'Paper Rings', 'Cornelia Street', 'Death By A Thousand Cuts'],
        fun: 'Cruel Summer se tornou um dos maiores hits da carreira de Taylor, anos após o lançamento do álbum!'
    },
    folklore: {
        name: 'Folklore',
        year: '2020',
        color: '#cfcfcf',
        desc: 'Criado durante a pandemia, Folklore é o mergulho de Taylor no indie folk. Histórias imaginárias, personagens fictícios e emoções reais em tons de cinza etéreo.',
        tracks: ['the 1', 'cardigan', 'the last great american dynasty', 'exile', 'my tears ricochet', 'mirrorball', 'seven', 'august', 'this is me trying', 'illicit affairs', 'invisible string', 'mad woman', 'epiphany', 'betty', 'peace', 'hoax'],
        fun: 'Folklore foi o álbum mais vendido de 2020 e ganhou o Grammy de Álbum do Ano em 2021!'
    },
    evermore: {
        name: 'Evermore',
        year: '2020',
        color: '#704214',
        desc: 'A irmã mais velha e mais sombria do Folklore. Uma antologia poética com personagens complexos e histórias de outono eterno.',
        tracks: ['willow', 'champagne problems', 'gold rush', 'tis the damn season', 'tolerate it', 'no body no crime', 'happiness', 'dorothea', 'coney island', 'ivy', 'cowboy like me', 'long story short', 'marjorie', 'closure', 'evermore'],
        fun: 'Taylor lançou Evermore exatamente um ano após Lover, como uma surpresa para os fãs!'
    },
    midnights: {
        name: 'Midnights',
        year: '2022',
        color: '#1d2a44',
        desc: '13 noites sem dormir transformadas em confissões musicais. O álbum mais íntimo e vulnerável de Taylor, explorando inseguranças e segredos das madrugadas.',
        tracks: ['Lavender Haze', 'Maroon', 'Anti-Hero', 'Snow on the Beach', 'Midnight Rain', 'Question...?', 'Vigilante Shit', 'Bejeweled', 'Labyrinth', 'Karma', 'Sweet Nothing', 'Mastermind', 'Hits Different', 'Would\'ve Could\'ve Should\'ve'],
        fun: 'Midnights quebrou o recorde de mais streams em um único dia no Spotify com 184.6 milhões em 24h!'
    },
    ttpd: {
        name: 'The Tortured Poets Department',
        year: '2024',
        color: '#4a4a4a',
        desc: 'A era mais longa e ambiciosa. 31 faixas de alternativa pop que exploram dor, criatividade e libertação. Taylor como poeta em sua forma mais bruta e exposta.',
        tracks: ['Fortnight', 'The Tortured Poets Department', 'My Boy Only Breaks His Favorite Toys', 'Down Bad', 'So Long, London', 'But Daddy I Love Him', 'Fresh Out the Slammer', 'Florida!!!', 'Guilty as Sin?', 'Who\'s Afraid of Little Old Me?'],
        fun: 'TTPD vendeu mais de 1 milhão de álbuns nos EUA na semana de lançamento, quebrando todos os recordes!'
    }
};

function openEraModal(era) {
    const data = eraModalData[era];
    if (!data) return;

    const modal = document.getElementById('era-modal');
    const inner = document.getElementById('era-modal-inner');

    inner.innerHTML = `
        <button onclick="closeEraModal()" style="position:absolute;top:16px;right:16px;background:transparent;border:1px solid rgba(255,255,255,0.1);color:#f0eade;width:32px;height:32px;border-radius:50%;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;">✕</button>
        <div style="border-top:3px solid ${data.color};padding-top:24px;margin-bottom:24px;">
            <span style="font-family:var(--font-mono);font-size:0.7rem;color:rgba(240,234,222,0.5);letter-spacing:2px;text-transform:uppercase;">${data.year}</span>
            <h2 style="font-family:var(--font-display);font-size:2.2rem;color:#f0eade;margin:8px 0;font-weight:900;">${data.name}</h2>
            <p style="font-family:var(--font-body);color:rgba(240,234,222,0.7);font-size:1.1rem;line-height:1.6;">${data.desc}</p>
        </div>
        <div style="margin-bottom:24px;">
            <h4 style="font-family:var(--font-mono);font-size:0.7rem;letter-spacing:2px;color:${data.color};text-transform:uppercase;margin-bottom:12px;">✦ FAIXAS PRINCIPAIS</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${data.tracks.map((t, i) => `
                    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                        <span style="font-family:var(--font-mono);font-size:0.65rem;color:rgba(240,234,222,0.3);width:20px;">${String(i+1).padStart(2,'0')}</span>
                        <span style="font-family:var(--font-body);color:#f0eade;font-size:1rem;">${t}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div style="background:rgba(${hexToRgb(data.color)},0.08);border:1px solid rgba(${hexToRgb(data.color)},0.2);border-radius:12px;padding:16px;">
            <h4 style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:2px;color:${data.color};text-transform:uppercase;margin-bottom:8px;">✦ VOCÊ SABIA?</h4>
            <p style="font-family:var(--font-body);color:rgba(240,234,222,0.8);font-size:1rem;line-height:1.5;">${data.fun}</p>
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeEraModal(e) {
    if (e && e.target !== document.getElementById('era-modal') && !e.target.classList.contains('era-modal')) return;
    document.getElementById('era-modal').classList.remove('open');
    document.body.style.overflow = 'auto';
}

function hexToRgb(hex) {
    if (!hex) return '212,175,55';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)}`
        : '212,175,55';
}

// ===== ERAS FILTER =====
function filterEra(genre, btn) {
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
}

// ===== TRIVIA =====
const triviaData = [
    { q: 'Em qual álbum está a música "All Too Well"?', opts: ['Fearless', 'Red', 'Speak Now', '1989'], ans: 1 },
    { q: 'Quantas versões de "All Too Well" foram lançadas?', opts: ['2', '3', '4', '5'], ans: 2 },
    { q: 'Qual foi o primeiro álbum de Taylor Swift?', opts: ['Fearless', 'Speak Now', 'Taylor Swift', 'Red'], ans: 2 },
    { q: '"Cruel Summer" pertence a qual álbum?', opts: ['1989', 'Midnights', 'Lover', 'Reputation'], ans: 2 },
    { q: 'Qual álbum Taylor escreveu completamente sozinha?', opts: ['Fearless', 'Red', 'Speak Now', 'Lover'], ans: 2 },
    { q: '"Anti-Hero" é do álbum:', opts: ['Folklore', 'Lover', 'Evermore', 'Midnights'], ans: 3 },
    { q: 'A Taylor ganhou quantos Grammy Awards de Álbum do Ano?', opts: ['2', '3', '4', '5'], ans: 2 },
    { q: '"cardigan" pertence a qual álbum?', opts: ['Evermore', 'Lover', 'Folklore', 'Reputation'], ans: 2 },
    { q: 'Qual é o número favorito da Taylor Swift?', opts: ['7', '11', '13', '22'], ans: 2 },
    { q: '"Fortnight" é a faixa de abertura de qual álbum?', opts: ['Midnights', 'Evermore', 'TTPD', 'Reputation'], ans: 2 },
    { q: '"exile" é uma colaboração de Taylor com:', opts: ['Ed Sheeran', 'Bon Iver', 'Haim', 'The National'], ans: 1 },
    { q: 'Qual era veio depois de Folklore em 2020?', opts: ['TTPD', 'Midnights', 'Evermore', 'Lover'], ans: 2 },
];

let currentTrivia = null;

function loadTrivia() {
    const q = triviaData[Math.floor(Math.random() * triviaData.length)];
    currentTrivia = q;

    document.getElementById('trivia-q').textContent = q.q;
    document.getElementById('trivia-result').textContent = '';

    const optsEl = document.getElementById('trivia-opts');
    optsEl.innerHTML = '';

    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'trivia-opt';
        btn.onclick = () => checkTrivia(i, btn);
        optsEl.appendChild(btn);
    });
}

function checkTrivia(chosen, btn) {
    const q = currentTrivia;
    const allBtns = document.querySelectorAll('.trivia-opt');
    allBtns.forEach(b => b.disabled = true);

    if (chosen === q.ans) {
        btn.classList.add('correct');
        document.getElementById('trivia-result').innerHTML = '<span style="color:#4caf50">✓ Correto! Você é uma verdadeira Swiftie! 🌟</span>';
        showToast('🌟 Resposta correta!');
    } else {
        btn.classList.add('wrong');
        allBtns[q.ans].classList.add('correct');
        document.getElementById('trivia-result').innerHTML = '<span style="color:#f44336">✗ Errado! Ouça mais Taylor! 💕</span>';
        showToast('💕 Quase lá! Tente de novo!');
    }
}

// ===== QUOTES =====
const quotes = [
    { text: 'Long story short, I survived.', era: '— Long Story Short, Evermore' },
    { text: 'She lost him but she found herself and somehow that was everything.', era: '— Clean, 1989' },
    { text: 'I had the time of my life fighting dragons with you.', era: '— Long Live, Speak Now' },
    { text: 'This is me trying.', era: '— This Is Me Trying, Folklore' },
    { text: 'I forgot that you existed. And I thought that it would kill me, but it didn\'t.', era: '— I Forgot That You Existed, Lover' },
    { text: 'Never be so kind you forget to be clever. Never be so clever you forget to be kind.', era: '— Ivy, Evermore' },
    { text: 'People are people and sometimes it doesn\'t work out.', era: '— Clean, 1989' },
    { text: 'This is a new depth I\'m in. I\'m not used to being here.', era: '— Down Bad, TTPD' },
    { text: 'Darling, I\'m a nightmare dressed like a daydream.', era: '— Blank Space, 1989' },
    { text: 'She\'s a mess of gorgeous chaos and you can see it written all over her face.', era: '— Unpublicized Quote' },
    { text: 'I once believed love would be burning red, but it\'s golden.', era: '— Daylight, Lover' },
    { text: 'My love was as cruel as the cities I lived in.', era: '— Call It What You Want, Reputation' },
    { text: 'In my defense, I have none. For never leaving well enough alone.', era: '— This Is Me Trying, Folklore' },
    { text: 'You\'re not my homeland anymore. So what am I defending now?', era: '— The Archer, Lover' },
];

function randomQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    const display = document.getElementById('quote-display');
    display.style.opacity = '0';
    setTimeout(() => {
        display.innerHTML = `
            <p class="quote-text">"${q.text}"</p>
            <p class="quote-era">${q.era}</p>
        `;
        display.style.opacity = '1';
        display.style.transition = 'opacity 0.4s ease';
    }, 200);
}

// ===== PLAYLISTS =====
const playlists = {
    fearless: ['Love Story', 'You Belong With Me', 'Fearless', 'The Best Day', 'White Horse', 'Change', 'Jump Then Fall', 'You Belong With Me', 'Hey Stephen', 'Tell Me Why'],
    red: ['All Too Well (10 Min)', 'State of Grace', 'Red', 'Treacherous', '22', 'I Knew You Were Trouble', 'Holy Ground', 'Sad Beautiful Tragic', 'Come Back...Be Here', 'Last Kiss'],
    '1989': ['Style', 'Shake It Off', 'Blank Space', 'Clean', 'Out of the Woods', 'Welcome to New York', 'How You Get the Girl', 'Wildest Dreams', 'New Romantics', 'Wonderland'],
    reputation: ['Delicate', 'Getaway Car', 'Don\'t Blame Me', 'Look What You Made Me Do', '...Ready for It?', 'I Did Something Bad', 'Call It What You Want', 'New Year\'s Day', 'Gorgeous', 'Dancing With Our Hands Tied'],
    lover: ['Cruel Summer', 'Lover', 'Paper Rings', 'The Archer', 'Miss Americana', 'Cornelia Street', 'Death By A Thousand Cuts', 'London Boy', 'Soon You\'ll Get Better', 'False God'],
    folklore: ['cardigan', 'august', 'seven', 'this is me trying', 'illicit affairs', 'the 1', 'exile (feat. Bon Iver)', 'epiphany', 'invisible string', 'mad woman'],
    midnights: ['Anti-Hero', 'Lavender Haze', 'Maroon', 'Midnight Rain', 'Karma', 'Snow on the Beach', 'Would\'ve Could\'ve Should\'ve', 'Bejeweled', 'Question...?', 'Mastermind'],
    ttpd: ['Fortnight', 'Down Bad', 'So Long, London', 'But Daddy I Love Him', 'Florida!!!', 'Guilty as Sin?', 'The Smallest Man Who Ever Lived', 'The Prophecy', 'imgonnagetyouback', 'The Tortured Poets Department'],
};

function showPlaylist() {
    const era = document.getElementById('playlist-era-select').value;
    const display = document.getElementById('playlist-display');
    if (!era || !playlists[era]) {
        display.innerHTML = '';
        return;
    }
    display.innerHTML = playlists[era].map((track, i) => `
        <div class="playlist-track">
            <span class="track-num">${i + 1}</span>
            <span class="track-name">${track}</span>
        </div>
    `).join('');
}

// ===== SONG OF THE DAY =====
const allSongs = [
    { title: 'All Too Well (10 Min)', album: 'Red (TV)' },
    { title: 'Cruel Summer', album: 'Lover' },
    { title: 'Anti-Hero', album: 'Midnights' },
    { title: 'cardigan', album: 'Folklore' },
    { title: 'Style', album: '1989 (TV)' },
    { title: 'Delicate', album: 'Reputation' },
    { title: 'Long Live', album: 'Speak Now (TV)' },
    { title: 'august', album: 'Folklore' },
    { title: 'New Romantics', album: '1989 (TV)' },
    { title: 'Fortnight', album: 'TTPD' },
    { title: 'Would\'ve Could\'ve Should\'ve', album: 'Midnights (3am)' },
    { title: 'marjorie', album: 'Evermore' },
    { title: 'seven', album: 'Folklore' },
    { title: 'Lavender Haze', album: 'Midnights' },
];

let songIndex = Math.floor(Math.random() * allSongs.length);

function nextSong() {
    songIndex = (songIndex + 1) % allSongs.length;
    const song = allSongs[songIndex];
    const titleEl = document.getElementById('sod-title');
    const albumEl = document.getElementById('sod-album');
    if (titleEl) titleEl.textContent = song.title;
    if (albumEl) albumEl.textContent = song.album;
    showToast(`♫ ${song.title}`);
}

// ===== ERA WHEEL =====
const eras = ['Fearless 🌟', 'Speak Now 🪄', 'Red ❤️', '1989 ☁️', 'Reputation 🐍', 'Lover 💕', 'Folklore 🌲', 'Evermore 🍂', 'Midnights 🌙', 'TTPD 🖊️'];

function spinWheel() {
    const wheel = document.getElementById('wheel-container');
    const text = document.getElementById('wheel-text');

    if (wheel.classList.contains('spinning')) return;

    text.textContent = '...';
    wheel.classList.add('spinning');

    setTimeout(() => {
        wheel.classList.remove('spinning');
        const era = eras[Math.floor(Math.random() * eras.length)];
        text.textContent = era.split(' ')[0];
        showToast(`🎡 Sua Era de hoje: ${era}`);
    }, 2000);
}

// ===== TOAST =====
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== EMOJI HELPER =====
function addEmoji(emoji) {
    const textarea = document.getElementById('texto-opiniao');
    if (textarea) {
        const pos = textarea.selectionStart;
        const val = textarea.value;
        textarea.value = val.substring(0, pos) + emoji + val.substring(pos);
        textarea.focus();
        showToast(emoji + ' adicionado!');
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicia trivia
    loadTrivia();

    // Inicializa song of the day
    const song = allSongs[songIndex];
    const sTitle = document.getElementById('sod-title');
    const sAlbum = document.getElementById('sod-album');
    if (sTitle) sTitle.textContent = song.title;
    if (sAlbum) sAlbum.textContent = song.album;

    // Era badge dinâmica
    const eras_list = ['Lover Era 💕', 'Midnights Era 🌙', 'Folklore Era 🌲', 'Reputation Era 🐍', '1989 Era ☁️'];
    const badge = document.getElementById('current-era-badge');
    if (badge) {
        let eraIdx = 0;
        setInterval(() => {
            eraIdx = (eraIdx + 1) % eras_list.length;
            badge.style.opacity = '0';
            setTimeout(() => {
                badge.textContent = eras_list[eraIdx];
                badge.style.opacity = '1';
            }, 200);
        }, 4000);
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(8, 8, 13, 0.97)';
        } else {
            header.style.background = 'rgba(13, 13, 20, 0.85)';
        }
    });
});
