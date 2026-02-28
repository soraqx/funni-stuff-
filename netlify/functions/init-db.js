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

    // Migrate image_data column from BYTEA to TEXT if needed
    await query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'images'
            AND column_name = 'image_data'
            AND data_type = 'bytea'
        ) THEN
          ALTER TABLE images ALTER COLUMN image_data TYPE TEXT USING encode(image_data, 'escape');
        END IF;
      END $$;
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
