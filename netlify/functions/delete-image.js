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
        const { imageId } = JSON.parse(event.body);

        if (!imageId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Image ID is required' }),
            };
        }

        await query('DELETE FROM images WHERE id = $1;', [imageId]);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Image deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting image:', error.message);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to delete image: ' + error.message }),
        };
    }
};
