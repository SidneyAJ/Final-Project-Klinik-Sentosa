const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function checkUnits() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT DISTINCT unit FROM medicines');
        console.log('Existing Units:', rows.map(r => r.unit));

        const [nullStock] = await connection.execute('SELECT COUNT(*) as count FROM medicines WHERE stock IS NULL OR stock = 0');
        console.log('Items with 0/Null stock:', nullStock[0].count);

    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

checkUnits();
