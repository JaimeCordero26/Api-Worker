const express = require('express');
const { Pool } = require('pg');
const app = express();
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'labdb',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASS || 'app',
  ssl: false
});
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      external_id INT UNIQUE,
      title TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/products', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY id DESC LIMIT 50;');
  res.json(rows);
});
init().then(() => app.listen(3000, () => console.log('API ready')))
  .catch(err => { console.error('Init error:', err); process.exit(1); });
