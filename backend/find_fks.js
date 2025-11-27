const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function findFKs() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(`
            SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE REFERENCED_TABLE_NAME = 'appointments' 
            AND TABLE_SCHEMA = 'klinik_sentosa'
        `);
        console.log('Tables referencing appointments:');
        console.log(rows);
    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

findFKs();
