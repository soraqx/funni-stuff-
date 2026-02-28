const { query, corsHeaders } = require('./db');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: '',
        };
    }

    try {
        const { catId } = event.queryStringParameters || {};

        if (!catId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Cat ID is required' }),
            };
        }

        const result = await query(
            'SELECT id, image_data FROM images WHERE cat_id = $1 ORDER BY created_at DESC;',
            [catId]
        );

        // Normalize image_data: BYTEA columns return a Buffer; convert back to the original data URL string
        const rows = result.rows.map(row => ({
            id: row.id,
            image_data: Buffer.isBuffer(row.image_data)
                ? row.image_data.toString('utf8')
                : String(row.image_data),
        }));

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error('Error fetching images:', error.message);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to fetch images: ' + error.message }),
        };
    }
};
