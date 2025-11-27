const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function listPcsUnits() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute("SELECT id, name, stock FROM medicines WHERE unit = 'pcs'");
        console.log('Medicines with unit "pcs":', rows);
    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

listPcsUnits();
