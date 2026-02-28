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
        const { catId, imageData } = JSON.parse(event.body);

        if (!catId || !imageData) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Cat ID and image data are required' }),
            };
        }

        // Verify cat exists
        const catCheck = await query('SELECT id FROM cats WHERE id = $1;', [catId]);
        if (catCheck.rows.length === 0) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Cat not found' }),
            };
        }

        // Store image as base64
        const result = await query(
            'INSERT INTO images (cat_id, image_data) VALUES ($1, $2) RETURNING id;',
            [catId, imageData]
        );

        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify({ id: result.rows[0].id }),
        };
    } catch (error) {
        console.error('Error uploading image:', error.message);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to upload image: ' + error.message }),
        };
    }
};

