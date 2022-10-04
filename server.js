const express = require('express');
const mysql = require('mysql2');
const app = express();
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        password: 'rootroot',
        database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
);

db.query('SELECT * FROM role', function (err, results) {
    console.table(results)
})


app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));