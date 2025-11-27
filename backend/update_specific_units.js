const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

const updates = [
    { name: 'Decolgen', unit: 'strip' },
    { name: 'Panadol Extra', unit: 'strip' },
    { name: 'Entrostop', unit: 'strip' },
    { name: 'Salonpas Koyo', unit: 'sachet' },
    { name: 'Becomzet', unit: 'strip' },
    { name: 'Antasida', unit: 'botol' },
    { name: 'Salbutamol Inhaler', unit: 'box' }
];

async function updateUnits() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        for (const item of updates) {
            const [result] = await connection.execute(
                "UPDATE medicines SET unit = ? WHERE name = ?",
                [item.unit, item.name]
            );
            console.log(`Updated ${item.name} to ${item.unit}: ${result.changedRows} rows changed.`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

updateUnits();
