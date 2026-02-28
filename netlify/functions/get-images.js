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

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result.rows),
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
};
