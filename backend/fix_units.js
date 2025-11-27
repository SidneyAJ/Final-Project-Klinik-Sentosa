const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function fixMissingUnits() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute("SELECT id, name FROM medicines WHERE unit IS NULL OR unit = ''");
        console.log(`Found ${rows.length} items with missing units.`);

        if (rows.length > 0) {
            console.log('Updating to "pcs"...');
            await connection.execute("UPDATE medicines SET unit = 'pcs' WHERE unit IS NULL OR unit = ''");
            console.log('Successfully updated all missing units to "pcs".');
        } else {
            console.log('All medicines already have units.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

fixMissingUnits();
