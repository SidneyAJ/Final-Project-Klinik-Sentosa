const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function checkMissingUnits() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute("SELECT id, name, unit FROM medicines WHERE unit IS NULL OR unit = ''");
        console.log('Medicines with missing units:', rows);

        if (rows.length > 0) {
            console.log(`Found ${rows.length} items. Updating them to default 'pcs'...`);
            // Uncomment to execute update
            // await connection.execute("UPDATE medicines SET unit = 'pcs' WHERE unit IS NULL OR unit = ''");
            // console.log('Updated successfully.');
        } else {
            console.log('No missing units found.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

checkMissingUnits();
