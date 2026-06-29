-- =====================================================
-- THE SWIFTIES NETWORK — Seed Data
-- Dados completos: Taylor Swift + Admin + Posts de exemplo
-- =====================================================

-- =====================================================
-- ADMIN USER (senha: admin123)
-- Hash bcrypt para 'admin123'
-- =====================================================
INSERT INTO users (username, email, password_hash, bio, favorite_era, role) VALUES
('admin', 'admin@tsn.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador do The Swifties Network', 'All Eras', 'admin');

-- Usuários de exemplo
INSERT INTO users (username, email, password_hash, bio, favorite_era, role) VALUES
('swiftie_lover', 'lover@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Apaixonada pela Lover Era 💕', 'Lover Era 💕', 'user'),
('midnight_dreams', 'midnight@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Noites de insônia com Midnights 🌙', 'Midnights Era 🌙', 'user'),
('folklore_tales', 'folk@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Perdida nas histórias do Folklore 🌲', 'Folklore Era 🌲', 'user');

-- =====================================================
-- ARTISTA: Taylor Swift
-- =====================================================
INSERT INTO artists (name, bio, image_url, cover_url, genre, spotify_url, instagram_url, twitter_url, monthly_listeners, total_albums, is_featured) VALUES
('Taylor Swift',
 'Taylor Alison Swift é uma cantora e compositora americana. Reconhecida por suas composições narrativas, que frequentemente abordam suas experiências pessoais, ela recebeu ampla atenção da mídia e é considerada uma das maiores artistas de todos os tempos.',
 'LOGO.jpg',
 'fundo.jpg',
 'Pop, Country, Indie Folk, Alternative',
 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
 'https://www.instagram.com/taylorswift/',
 'https://twitter.com/taylorswift13',
 '115 milhões',
 11,
 TRUE);

-- =====================================================
-- ÁLBUNS (todos os 10+ eras)
-- =====================================================

-- 1. Taylor Swift (Debut)
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Taylor Swift', 2006, '2006-10-24', 'country', 'Country Pop', '#4a8c6f', '#1a3d2a', 'foto_1.png',
 'O álbum de estreia que apresentou Taylor Swift ao mundo. Com apenas 16 anos, ela co-escreveu todas as faixas, mostrando uma maturidade lírica impressionante para sua idade.',
 11, 'Taylor Swift é o álbum country de estreia mais vendido nos EUA desde 2000!', 40, FALSE, NULL);

-- 2. Fearless (Taylor''s Version)
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Fearless (Taylor''s Version)', 2008, '2021-04-09', 'country', 'Country Pop', '#ebb753', '#8a6200', 'Fearless_(Taylor''s_Version).png',
 'O álbum que lançou Taylor ao estrelato global. Com um som country pop dourado, o disco captura a inocência e coragem de amar sendo jovem.',
 26, 'Fearless ganhou o Grammy de Álbum do Ano em 2010, tornando Taylor a mais jovem artista a vencer na categoria!', 106, TRUE, 2008);

-- 3. Speak Now (Taylor''s Version)
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Speak Now (Taylor''s Version)', 2010, '2023-07-07', 'country', 'Country Rock', '#a52a2a', '#5a0000', 'speak-now.jpeg',
 'O único álbum escrito inteiramente por Taylor. Repleto de encantamento, romantismo e narrativas elaboradas que mostram seu talento como contadora de histórias.',
 22, 'Taylor escreveu Speak Now inteiramente sozinha para provar sua capacidade como compositora!', 95, TRUE, 2010);

-- 4. Red (Taylor''s Version)
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Red (Taylor''s Version)', 2012, '2021-11-12', 'pop', 'Country Pop', '#8b0000', '#3d0000', 'red.jpg',
 'O álbum mais emocional de Taylor. Uma mistura única de country, pop, rock e folk que captura todas as cores de um amor intenso e avassalador.',
 30, 'All Too Well (10 Min Version) é a canção mais longa a chegar ao #1 na Billboard Hot 100!', 131, TRUE, 2012);

-- 5. 1989 (Taylor''s Version)
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, '1989 (Taylor''s Version)', 2014, '2023-10-27', 'pop', 'Synth-Pop', '#b1d4e0', '#2a6d85', '1989.jpeg',
 'A transição definitiva para o pop. Inspirado nos anos 80, o álbum é uma explosão de synths, Polaroids e hits eternos gravados nas noites de Nova York.',
 21, '1989 foi o álbum mais vendido de 2014 globalmente, com mais de 10 milhões de cópias!', 78, TRUE, 2014);

-- 6. Reputation
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Reputation', 2017, '2017-11-10', 'pop', 'Electropop', '#1a1a1a', '#000000', 'Reputation_-_Taylor_Swift.png',
 'A reinvenção sombria e poderosa. Após anos de controvérsias midiáticas, Taylor voltou com uma nova persona: mais dark, mais direta e com garras afiadas.',
 15, 'Reputation é o álbum mais vendido de 2017 nos EUA, com mais de 1.2 milhões de cópias na primeira semana!', 56, FALSE, NULL);

-- 7. Lover
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Lover', 2019, '2019-08-23', 'pop', 'Pop', '#ff9fb5', '#b5004a', 'lover.jpg',
 'A declaração de amor mais colorida de Taylor. Com paleta pastel de rosas e azuis, Lover é puro e alegre, capturando o sentimento de amor em sua forma mais doce.',
 18, 'Cruel Summer se tornou um dos maiores hits da carreira de Taylor, anos após o lançamento do álbum!', 62, FALSE, NULL);

-- 8. Folklore
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Folklore', 2020, '2020-07-24', 'indie', 'Indie Folk', '#cfcfcf', '#555555', 'Folkclore.avif',
 'Criado durante a pandemia, Folklore é o mergulho de Taylor no indie folk. Histórias imaginárias, personagens fictícios e emoções reais em tons de cinza etéreo.',
 16, 'Folklore foi o álbum mais vendido de 2020 e ganhou o Grammy de Álbum do Ano em 2021!', 63, FALSE, NULL);

-- 9. Evermore
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Evermore', 2020, '2020-12-11', 'indie', 'Indie Folk', '#704214', '#3a1a00', 'evermore.avif',
 'A irmã mais velha e mais sombria do Folklore. Uma antologia poética com personagens complexos e histórias de outono eterno.',
 15, 'Taylor lançou Evermore como uma surpresa para os fãs, consolidando sua versatilidade artística.', 60, FALSE, NULL);

-- 10. Midnights
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'Midnights', 2022, '2022-10-21', 'pop', 'Synth-Pop', '#1d2a44', '#050a14', 'midnights.jpg',
 '13 noites sem dormir transformadas em confissões musicais. O álbum mais íntimo e vulnerável de Taylor, explorando inseguranças e segredos das madrugadas.',
 20, 'Midnights quebrou o recorde de mais streams em um único dia no Spotify com 184.6 milhões em 24h!', 68, FALSE, NULL);

-- 11. The Tortured Poets Department
INSERT INTO albums (artist_id, title, year, release_date, genre, sub_genre, color_hex, color_dark, image_url, description, track_count, fun_fact, duration_minutes, is_taylors_version, original_year) VALUES
(1, 'The Tortured Poets Department', 2024, '2024-04-19', 'pop', 'Alternative Pop', '#4a4a4a', '#1a1a1a', 'TTDP.jpeg',
 'A era mais longa e ambiciosa. 31 faixas de alternativa pop que exploram dor, criatividade e libertação. Taylor como poeta em sua forma mais bruta e exposta.',
 31, 'TTPD vendeu mais de 1 milhão de álbuns nos EUA na semana de lançamento, quebrando todos os recordes!', 120, FALSE, NULL);

-- =====================================================
-- FAIXAS — Todos os álbuns
-- =====================================================

-- Taylor Swift (Debut) - Album ID 1
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(1, 'Tim McGraw', 1, 232, TRUE, TRUE, NULL),
(1, 'Picture to Burn', 2, 173, TRUE, TRUE, NULL),
(1, 'Teardrops on My Guitar', 3, 230, TRUE, TRUE, NULL),
(1, 'A Place in This World', 4, 199, FALSE, FALSE, NULL),
(1, 'Cold As You', 5, 241, FALSE, FALSE, NULL),
(1, 'The Outside', 6, 213, FALSE, FALSE, NULL),
(1, 'Tied Together with a Smile', 7, 246, FALSE, FALSE, NULL),
(1, 'Stay Beautiful', 8, 237, FALSE, FALSE, NULL),
(1, 'Should''ve Said No', 9, 244, TRUE, TRUE, NULL),
(1, 'Mary''s Song (Oh My My My)', 10, 217, FALSE, FALSE, NULL),
(1, 'Our Song', 11, 204, TRUE, TRUE, NULL);

-- Fearless (Taylor''s Version) - Album ID 2
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(2, 'Fearless', 1, 241, TRUE, FALSE, NULL),
(2, 'Fifteen', 2, 294, TRUE, TRUE, NULL),
(2, 'Love Story', 3, 235, TRUE, TRUE, NULL),
(2, 'Hey Stephen', 4, 254, FALSE, FALSE, NULL),
(2, 'White Horse', 5, 234, TRUE, TRUE, NULL),
(2, 'You Belong With Me', 6, 231, TRUE, TRUE, NULL),
(2, 'Breathe', 7, 262, FALSE, FALSE, 'Colbie Caillat'),
(2, 'Tell Me Why', 8, 200, FALSE, FALSE, NULL),
(2, 'You''re Not Sorry', 9, 266, TRUE, FALSE, NULL),
(2, 'The Way I Loved You', 10, 244, FALSE, FALSE, NULL),
(2, 'Forever & Always', 11, 227, FALSE, FALSE, NULL),
(2, 'The Best Day', 12, 247, TRUE, FALSE, NULL),
(2, 'Change', 13, 280, FALSE, FALSE, NULL),
(2, 'Jump Then Fall', 14, 233, FALSE, FALSE, NULL),
(2, 'Untouchable', 15, 324, FALSE, FALSE, NULL),
(2, 'Come In With the Rain', 16, 234, FALSE, FALSE, NULL),
(2, 'SuperStar', 17, 231, FALSE, FALSE, NULL),
(2, 'The Other Side of the Door', 18, 241, FALSE, FALSE, NULL),
(2, 'Today Was a Fairytale', 19, 241, TRUE, TRUE, NULL),
(2, 'You All Over Me', 20, 218, FALSE, FALSE, 'Maren Morris'),
(2, 'Mr. Perfectly Fine', 21, 277, TRUE, FALSE, NULL),
(2, 'We Were Happy', 22, 241, FALSE, FALSE, NULL),
(2, 'That''s When', 23, 211, FALSE, FALSE, 'Keith Urban'),
(2, 'Don''t You', 24, 197, FALSE, FALSE, NULL),
(2, 'Bye Bye Baby', 25, 252, FALSE, FALSE, NULL),
(2, 'Love Story (Elvira Remix)', 26, 203, FALSE, FALSE, NULL);

-- Speak Now (Taylor''s Version) - Album ID 3
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(3, 'Mine', 1, 231, TRUE, TRUE, NULL),
(3, 'Sparks Fly', 2, 264, TRUE, FALSE, NULL),
(3, 'Back to December', 3, 293, TRUE, TRUE, NULL),
(3, 'Speak Now', 4, 245, TRUE, FALSE, NULL),
(3, 'Dear John', 5, 406, TRUE, FALSE, NULL),
(3, 'Mean', 6, 239, TRUE, TRUE, NULL),
(3, 'The Story of Us', 7, 267, TRUE, TRUE, NULL),
(3, 'Never Grow Up', 8, 284, FALSE, FALSE, NULL),
(3, 'Enchanted', 9, 352, TRUE, FALSE, NULL),
(3, 'Better Than Revenge', 10, 213, TRUE, FALSE, NULL),
(3, 'Innocent', 11, 320, FALSE, FALSE, NULL),
(3, 'Haunted', 12, 244, FALSE, FALSE, NULL),
(3, 'Last Kiss', 13, 362, TRUE, FALSE, NULL),
(3, 'Long Live', 14, 322, TRUE, FALSE, NULL),
(3, 'Ours', 15, 237, FALSE, TRUE, NULL),
(3, 'Superman', 16, 284, FALSE, FALSE, NULL),
(3, 'Electric Touch', 17, 254, FALSE, FALSE, 'Fall Out Boy'),
(3, 'When Emma Falls in Love', 18, 264, FALSE, FALSE, NULL),
(3, 'I Can See You', 19, 243, TRUE, FALSE, NULL),
(3, 'Castles Crumbling', 20, 264, FALSE, FALSE, 'Hayley Williams'),
(3, 'Foolish One', 21, 254, FALSE, FALSE, NULL),
(3, 'Timeless', 22, 265, FALSE, FALSE, NULL);

-- Red (Taylor''s Version) - Album ID 4
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(4, 'State of Grace', 1, 295, TRUE, FALSE, NULL),
(4, 'Red', 2, 223, TRUE, FALSE, NULL),
(4, 'Treacherous', 3, 244, TRUE, FALSE, NULL),
(4, 'I Knew You Were Trouble', 4, 220, TRUE, TRUE, NULL),
(4, 'All Too Well', 5, 329, TRUE, FALSE, NULL),
(4, '22', 6, 232, TRUE, TRUE, NULL),
(4, 'I Almost Do', 7, 244, FALSE, FALSE, NULL),
(4, 'We Are Never Ever Getting Back Together', 8, 193, TRUE, TRUE, NULL),
(4, 'Stay Stay Stay', 9, 158, FALSE, FALSE, NULL),
(4, 'The Last Time', 10, 293, FALSE, FALSE, 'Gary Lightbody'),
(4, 'Holy Ground', 11, 204, TRUE, FALSE, NULL),
(4, 'Sad Beautiful Tragic', 12, 270, FALSE, FALSE, NULL),
(4, 'The Lucky One', 13, 241, FALSE, FALSE, NULL),
(4, 'Everything Has Changed', 14, 247, TRUE, TRUE, 'Ed Sheeran'),
(4, 'Starlight', 15, 222, FALSE, FALSE, NULL),
(4, 'Begin Again', 16, 238, TRUE, TRUE, NULL),
(4, 'The Moment I Knew', 17, 285, FALSE, FALSE, NULL),
(4, 'Come Back...Be Here', 18, 237, FALSE, FALSE, NULL),
(4, 'Girl at Home', 19, 224, FALSE, FALSE, NULL),
(4, 'State of Grace (Acoustic)', 20, 326, FALSE, FALSE, NULL),
(4, 'Ronan', 21, 249, FALSE, FALSE, NULL),
(4, 'Better Man', 22, 264, TRUE, FALSE, NULL),
(4, 'Nothing New', 23, 262, TRUE, FALSE, 'Phoebe Bridgers'),
(4, 'Babe', 24, 227, FALSE, FALSE, NULL),
(4, 'Message in a Bottle', 25, 221, TRUE, FALSE, NULL),
(4, 'I Bet You Think About Me', 26, 255, TRUE, FALSE, 'Chris Stapleton'),
(4, 'Forever Winter', 27, 249, FALSE, FALSE, NULL),
(4, 'Run', 28, 224, FALSE, FALSE, 'Ed Sheeran'),
(4, 'The Very First Night', 29, 218, FALSE, FALSE, NULL),
(4, 'All Too Well (10 Minute Version)', 30, 613, TRUE, TRUE, NULL);

-- 1989 (Taylor''s Version) - Album ID 5
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(5, 'Welcome to New York', 1, 212, TRUE, TRUE, NULL),
(5, 'Blank Space', 2, 231, TRUE, TRUE, NULL),
(5, 'Style', 3, 231, TRUE, TRUE, NULL),
(5, 'Out of the Woods', 4, 236, TRUE, TRUE, NULL),
(5, 'All You Had to Do Was Stay', 5, 193, FALSE, FALSE, NULL),
(5, 'Shake It Off', 6, 219, TRUE, TRUE, NULL),
(5, 'I Wish You Would', 7, 210, FALSE, FALSE, NULL),
(5, 'Bad Blood', 8, 211, TRUE, TRUE, NULL),
(5, 'Wildest Dreams', 9, 220, TRUE, TRUE, NULL),
(5, 'How You Get the Girl', 10, 247, FALSE, FALSE, NULL),
(5, 'This Love', 11, 258, TRUE, FALSE, NULL),
(5, 'I Know Places', 12, 210, FALSE, FALSE, NULL),
(5, 'Clean', 13, 272, TRUE, FALSE, NULL),
(5, 'Wonderland', 14, 224, FALSE, FALSE, NULL),
(5, 'You Are in Love', 15, 266, TRUE, FALSE, NULL),
(5, 'New Romantics', 16, 230, TRUE, FALSE, NULL),
(5, '"Slut!"', 17, 233, TRUE, FALSE, NULL),
(5, 'Say Don''t Go', 18, 229, FALSE, FALSE, NULL),
(5, 'Now That We Don''t Talk', 19, 166, TRUE, FALSE, NULL),
(5, 'Suburban Legends', 20, 229, FALSE, FALSE, NULL),
(5, 'Is It Over Now?', 21, 228, TRUE, FALSE, NULL);

-- Reputation - Album ID 6
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(6, '...Ready for It?', 1, 208, TRUE, TRUE, NULL),
(6, 'End Game', 2, 245, TRUE, TRUE, 'Ed Sheeran, Future'),
(6, 'I Did Something Bad', 3, 238, TRUE, FALSE, NULL),
(6, 'Don''t Blame Me', 4, 236, TRUE, FALSE, NULL),
(6, 'Delicate', 5, 232, TRUE, TRUE, NULL),
(6, 'Look What You Made Me Do', 6, 211, TRUE, TRUE, NULL),
(6, 'So It Goes...', 7, 227, FALSE, FALSE, NULL),
(6, 'Gorgeous', 8, 209, TRUE, TRUE, NULL),
(6, 'Getaway Car', 9, 234, TRUE, FALSE, NULL),
(6, 'King of My Heart', 10, 223, FALSE, FALSE, NULL),
(6, 'Dancing With Our Hands Tied', 11, 212, FALSE, FALSE, NULL),
(6, 'Dress', 12, 232, FALSE, FALSE, NULL),
(6, 'This Is Why We Can''t Have Nice Things', 13, 206, TRUE, FALSE, NULL),
(6, 'Call It What You Want', 14, 206, TRUE, FALSE, NULL),
(6, 'New Year''s Day', 15, 223, TRUE, FALSE, NULL);

-- Lover - Album ID 7
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(7, 'I Forgot That You Existed', 1, 170, FALSE, FALSE, NULL),
(7, 'Cruel Summer', 2, 178, TRUE, TRUE, NULL),
(7, 'Lover', 3, 221, TRUE, TRUE, NULL),
(7, 'The Man', 4, 193, TRUE, TRUE, NULL),
(7, 'The Archer', 5, 231, TRUE, FALSE, NULL),
(7, 'I Think He Knows', 6, 170, FALSE, FALSE, NULL),
(7, 'Miss Americana & the Heartbreak Prince', 7, 233, TRUE, FALSE, NULL),
(7, 'Paper Rings', 8, 222, TRUE, FALSE, NULL),
(7, 'Cornelia Street', 9, 287, TRUE, FALSE, NULL),
(7, 'Death By A Thousand Cuts', 10, 199, TRUE, FALSE, NULL),
(7, 'London Boy', 11, 198, FALSE, FALSE, NULL),
(7, 'Soon You''ll Get Better', 12, 215, TRUE, FALSE, 'The Chicks'),
(7, 'False God', 13, 210, FALSE, FALSE, NULL),
(7, 'You Need to Calm Down', 14, 171, TRUE, TRUE, NULL),
(7, 'Afterglow', 15, 228, FALSE, FALSE, NULL),
(7, 'ME!', 16, 193, TRUE, TRUE, 'Brendon Urie'),
(7, 'It''s Nice to Have a Friend', 17, 163, FALSE, FALSE, NULL),
(7, 'Daylight', 18, 293, TRUE, FALSE, NULL);

-- Folklore - Album ID 8
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(8, 'the 1', 1, 210, TRUE, FALSE, NULL),
(8, 'cardigan', 2, 239, TRUE, TRUE, NULL),
(8, 'the last great american dynasty', 3, 228, TRUE, FALSE, NULL),
(8, 'exile', 4, 284, TRUE, TRUE, 'Bon Iver'),
(8, 'my tears ricochet', 5, 260, TRUE, FALSE, NULL),
(8, 'mirrorball', 6, 212, FALSE, FALSE, NULL),
(8, 'seven', 7, 229, TRUE, FALSE, NULL),
(8, 'august', 8, 262, TRUE, FALSE, NULL),
(8, 'this is me trying', 9, 191, TRUE, FALSE, NULL),
(8, 'illicit affairs', 10, 193, TRUE, FALSE, NULL),
(8, 'invisible string', 11, 253, TRUE, FALSE, NULL),
(8, 'mad woman', 12, 237, FALSE, FALSE, NULL),
(8, 'epiphany', 13, 296, FALSE, FALSE, NULL),
(8, 'betty', 14, 295, TRUE, TRUE, NULL),
(8, 'peace', 15, 234, FALSE, FALSE, NULL),
(8, 'hoax', 16, 224, FALSE, FALSE, NULL);

-- Evermore - Album ID 9
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(9, 'willow', 1, 214, TRUE, TRUE, NULL),
(9, 'champagne problems', 2, 244, TRUE, FALSE, NULL),
(9, 'gold rush', 3, 185, TRUE, FALSE, NULL),
(9, '''tis the damn season', 4, 230, TRUE, FALSE, NULL),
(9, 'tolerate it', 5, 256, TRUE, FALSE, NULL),
(9, 'no body, no crime', 6, 215, TRUE, FALSE, 'HAIM'),
(9, 'happiness', 7, 312, FALSE, FALSE, NULL),
(9, 'dorothea', 8, 233, FALSE, FALSE, NULL),
(9, 'coney island', 9, 271, FALSE, FALSE, 'The National'),
(9, 'ivy', 10, 261, TRUE, FALSE, NULL),
(9, 'cowboy like me', 11, 281, TRUE, FALSE, NULL),
(9, 'long story short', 12, 214, TRUE, FALSE, NULL),
(9, 'marjorie', 13, 260, TRUE, FALSE, NULL),
(9, 'closure', 14, 181, FALSE, FALSE, NULL),
(9, 'evermore', 15, 305, TRUE, FALSE, 'Bon Iver');

-- Midnights - Album ID 10
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(10, 'Lavender Haze', 1, 202, TRUE, TRUE, NULL),
(10, 'Maroon', 2, 218, TRUE, FALSE, NULL),
(10, 'Anti-Hero', 3, 200, TRUE, TRUE, NULL),
(10, 'Snow on the Beach', 4, 254, TRUE, TRUE, 'Lana Del Rey'),
(10, 'You''re on Your Own, Kid', 5, 194, TRUE, FALSE, NULL),
(10, 'Midnight Rain', 6, 174, TRUE, FALSE, NULL),
(10, 'Question...?', 7, 210, FALSE, FALSE, NULL),
(10, 'Vigilante Shit', 8, 164, TRUE, FALSE, NULL),
(10, 'Bejeweled', 9, 194, TRUE, TRUE, NULL),
(10, 'Labyrinth', 10, 247, FALSE, FALSE, NULL),
(10, 'Karma', 11, 205, TRUE, TRUE, NULL),
(10, 'Sweet Nothing', 12, 183, FALSE, FALSE, NULL),
(10, 'Mastermind', 13, 211, TRUE, FALSE, NULL),
(10, 'The Great War', 14, 236, FALSE, FALSE, NULL),
(10, 'Bigger Than the Whole Sky', 15, 218, FALSE, FALSE, NULL),
(10, 'Paris', 16, 196, FALSE, FALSE, NULL),
(10, 'High Infidelity', 17, 216, FALSE, FALSE, NULL),
(10, 'Glitch', 18, 178, FALSE, FALSE, NULL),
(10, 'Would''ve, Could''ve, Should''ve', 19, 289, TRUE, FALSE, NULL),
(10, 'Dear Reader', 20, 245, FALSE, FALSE, NULL);

-- The Tortured Poets Department - Album ID 11
INSERT INTO tracks (album_id, title, track_number, duration_seconds, is_popular, is_single, featuring) VALUES
(11, 'Fortnight', 1, 229, TRUE, TRUE, 'Post Malone'),
(11, 'The Tortured Poets Department', 2, 293, TRUE, FALSE, NULL),
(11, 'My Boy Only Breaks His Favorite Toys', 3, 203, TRUE, FALSE, NULL),
(11, 'Down Bad', 4, 261, TRUE, TRUE, NULL),
(11, 'So Long, London', 5, 262, TRUE, FALSE, NULL),
(11, 'But Daddy I Love Him', 6, 342, TRUE, FALSE, NULL),
(11, 'Fresh Out the Slammer', 7, 210, FALSE, FALSE, NULL),
(11, 'Florida!!!', 8, 214, TRUE, FALSE, 'Florence + the Machine'),
(11, 'Guilty as Sin?', 9, 254, TRUE, FALSE, NULL),
(11, 'Who''s Afraid of Little Old Me?', 10, 334, TRUE, FALSE, NULL),
(11, 'I Can Fix Him (No Really I Can)', 11, 156, FALSE, FALSE, NULL),
(11, 'loml', 12, 278, TRUE, FALSE, NULL),
(11, 'I Can Do It With a Broken Heart', 13, 217, TRUE, TRUE, NULL),
(11, 'The Smallest Man Who Ever Lived', 14, 234, TRUE, FALSE, NULL),
(11, 'The Alchemy', 15, 197, FALSE, FALSE, NULL),
(11, 'Clara Bow', 16, 215, FALSE, FALSE, NULL),
(11, 'The Black Dog', 17, 238, TRUE, FALSE, NULL),
(11, 'imgonnagetyouback', 18, 175, TRUE, FALSE, NULL),
(11, 'The Albatross', 19, 177, FALSE, FALSE, NULL),
(11, 'Chloe or Sam or Sophia or Marcus', 20, 252, FALSE, FALSE, NULL),
(11, 'How Did It End?', 21, 263, TRUE, FALSE, NULL),
(11, 'So High School', 22, 224, FALSE, FALSE, NULL),
(11, 'I Hate It Here', 23, 302, FALSE, FALSE, NULL),
(11, 'thanK you aIMee', 24, 265, TRUE, FALSE, NULL),
(11, 'I Look in People''s Windows', 25, 188, FALSE, FALSE, NULL),
(11, 'The Prophecy', 26, 246, TRUE, FALSE, NULL),
(11, 'Cassandra', 27, 263, TRUE, FALSE, NULL),
(11, 'Peter', 28, 250, FALSE, FALSE, NULL),
(11, 'The Bolter', 29, 199, FALSE, FALSE, NULL),
(11, 'Robin', 30, 226, FALSE, FALSE, NULL),
(11, 'The Manuscript', 31, 233, TRUE, FALSE, NULL);

-- =====================================================
-- POSTS DE EXEMPLO
-- =====================================================
INSERT INTO posts (user_id, content, era_tag, likes_count) VALUES
(2, 'Cruel Summer é a melhor música de todos os tempos! Não aceito argumentos 💕☀️', 'Lover Era 💕', 15),
(3, 'Midnights mudou minha vida. Anti-Hero é um hino para quem se sente perdida 🌙', 'Midnights Era 🌙', 23),
(4, 'cardigan + august + betty = a melhor trilogia musical já criada 🌲✨', 'Folklore Era 🌲', 31),
(2, 'All Too Well (10 Min) me faz chorar TODA VEZ. Taylor é uma poeta 😭❤️', 'Red Era ❤️', 42),
(3, 'Acabei de ouvir TTPD inteiro pela 50ª vez e ainda descubro coisas novas 🖊️', 'TTPD Era 🖊️', 18),
(4, 'Reputation é o álbum mais underrated. Getaway Car é perfeição 🐍🖤', 'Reputation Era 🐍', 27),
(1, 'Bem-vindos ao The Swifties Network! Esse espaço é de vocês. Compartilhem suas eras favoritas! ✦', NULL, 50);

-- =====================================================
-- PLAYLISTS DE EXEMPLO
-- =====================================================
INSERT INTO playlists (user_id, name, description, is_public) VALUES
(2, 'Melhores Ballads', 'As melhores baladas de todas as eras da Taylor', TRUE),
(3, 'Noites de Insônia', 'Para ouvir às 3 da manhã quando o mundo dorme', TRUE),
(4, 'Road Trip Swiftie', 'Para cantar no carro sem parar', TRUE);
