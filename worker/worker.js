import cron from 'node-cron';
import fetch from 'node-fetch';
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'labdb',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASS || 'app',
  ssl: false
});
const CRON = process.env.CRON || '*/1 * * * *';
async function pullProducts() {
  const url = 'https://dummyjson.com/products?limit=5&select=id,title,price';
  const res = await fetch(url);
  const data = await res.json();
  const products = data?.products ?? [];
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (external_id, title, price)
       VALUES ($1, $2, $3)
       ON CONFLICT (external_id) DO NOTHING;`,
      [p.id, p.title, p.price]
    );
  }
  console.log(`[${new Date().toISOString()}] Inserted/kept ${products.length} products.`);
}
console.log(`Worker scheduled with CRON: ${CRON}`);
cron.schedule(CRON, pullProducts);
pullProducts().catch(console.error);
