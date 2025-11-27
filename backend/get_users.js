const db = require('./database');

console.log('Fetching all users from database...\n');

db.all('SELECT id, email, username, role, name FROM users ORDER BY id', [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
        process.exit(1);
    }

    console.log('Total users:', rows.length);
    console.log('\n--- ALL USERS ---\n');

    rows.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Username: ${user.username || 'N/A'}`);
        console.log(`Role: ${user.role}`);
        console.log(`Name: ${user.name}`);
        console.log('---');
    });

    process.exit(0);
});
