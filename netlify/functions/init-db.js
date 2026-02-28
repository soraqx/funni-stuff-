const { query } = require('./db');

exports.handler = async (event, context) => {
  try {
    // Create cats table
    await query(`
      CREATE TABLE IF NOT EXISTS cats (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create images table
    await query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        cat_id INTEGER NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
        image_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index for faster queries
    await query(`
      CREATE INDEX IF NOT EXISTS idx_images_cat_id ON images(cat_id);
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database initialized successfully' }),
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
