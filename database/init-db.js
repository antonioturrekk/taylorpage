const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDB() {
  // Connect to default postgres database first to create our database
  const adminPool = new Pool({
    connectionString: process.env.DATABASE_URL.replace(/\/[^/]*$/, '/postgres'),
  });

  try {
    console.log('🔧 Verificando se o banco de dados existe...');
    const dbName = 'taylorswift_network';

    const dbCheck = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`📦 Criando banco de dados "${dbName}"...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log('✅ Banco de dados criado!');
    } else {
      console.log('✅ Banco de dados já existe.');
    }
  } catch (err) {
    if (err.code === '42P04') {
      console.log('✅ Banco de dados já existe.');
    } else {
      console.error('❌ Erro ao criar banco:', err.message);
    }
  } finally {
    await adminPool.end();
  }

  // Now connect to our database and run init + seed
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Run init.sql
    console.log('\n📋 Executando schema (init.sql)...');
    const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(initSQL);
    console.log('✅ Schema criado com sucesso!');

    // Generate proper bcrypt hash for admin123
    console.log('\n🔐 Gerando hash de senha para o admin...');
    const adminHash = await bcrypt.hash('admin123', 10);

    // Read seed.sql and replace placeholder hash with real one
    console.log('\n🌱 Executando seed data (seed.sql)...');
    let seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    // Replace all placeholder hashes with the real one
    seedSQL = seedSQL.replace(/\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy/g, adminHash);

    await pool.query(seedSQL);
    console.log('✅ Dados inseridos com sucesso!');

    // Verify
    const stats = await pool.query('SELECT * FROM vw_platform_stats');
    console.log('\n📊 Estatísticas da plataforma:');
    console.log(`   👥 Usuários: ${stats.rows[0].total_users}`);
    console.log(`   🎤 Artistas: ${stats.rows[0].total_artists}`);
    console.log(`   💿 Álbuns: ${stats.rows[0].total_albums}`);
    console.log(`   🎵 Faixas: ${stats.rows[0].total_tracks}`);
    console.log(`   📝 Posts: ${stats.rows[0].total_posts}`);

    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('📋 Conecte-se via DBeaver:');
    console.log('   Host: localhost');
    console.log('   Port: 5432');
    console.log('   Database: taylorswift_network');
    console.log('   User: postgres');
    console.log('   Password: postgres');
    console.log('\n🔑 Admin login:');
    console.log('   Email: admin@tsn.com');
    console.log('   Senha: admin123');

  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

initDB();
