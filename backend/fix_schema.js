const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function fixSchema() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log('Altering table to change unit column to VARCHAR(50)...');
        await connection.execute("ALTER TABLE medicines MODIFY COLUMN unit VARCHAR(50)");
        console.log('Schema updated successfully.');

        // Verify
        const [schema] = await connection.execute("DESCRIBE medicines");
        console.log('New Schema for unit:', schema.find(c => c.Field === 'unit'));

    } catch (error) {
        console.error('Error altering table:', error);
    } finally {
        await connection.end();
    }
}

fixSchema();
