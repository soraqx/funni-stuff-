const { Pool } = require('pg');

console.log('Database URL configured:', !!process.env.NETLIFY_DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
});

async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error.message, { text, params });
        throw error;
    }
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

module.exports = { pool, query, corsHeaders };
