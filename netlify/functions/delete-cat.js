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
        const { catId } = JSON.parse(event.body);

        if (!catId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Cat ID is required' }),
            };
        }

        await query('DELETE FROM cats WHERE id = $1;', [catId]);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Cat deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting cat:', error.message);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to delete cat: ' + error.message }),
        };
    }
};
