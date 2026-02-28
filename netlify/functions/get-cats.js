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
        const result = await query('SELECT id, name FROM cats ORDER BY created_at DESC;');

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(result.rows),
        };
    } catch (error) {
        console.error('Error fetching cats:', error.message);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to fetch cats: ' + error.message }),
        };
    }
};
