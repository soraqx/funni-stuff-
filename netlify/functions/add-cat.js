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
        const { name } = JSON.parse(event.body);

        if (!name || !name.trim()) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Cat name is required' }),
            };
        }

        const result = await query(
            'INSERT INTO cats (name) VALUES ($1) RETURNING id, name;',
            [name.trim()]
        );

        return {
            statusCode: 201,
            headers: corsHeaders,
            body: JSON.stringify(result.rows[0]),
        };
    } catch (error) {
        console.error('Error adding cat:', error.message);
        if (error.code === '23505') {
            // Unique constraint violation
            return {
                statusCode: 409,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'A cat with this name already exists' }),
            };
        }
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Failed to add cat: ' + error.message }),
        };
    }
};
