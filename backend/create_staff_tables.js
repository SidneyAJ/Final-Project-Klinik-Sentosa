const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'klinik_sentosa'
};

async function createTables() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        // Create nurses table
        console.log('Creating nurses table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS nurses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                specialization VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ nurses table created');

        // Create pharmacists table
        console.log('Creating pharmacists table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS pharmacists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                license_number VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✓ pharmacists table created');

        console.log('\n✅ All tables created successfully!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();
    }
}

createTables();
