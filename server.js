const express = require('express');
const mysql = require('mysql2');
const app = express();
const cTable = require('console.table');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employeetracker_db'
    },
);

function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
                name: 'whatDo'
            }
        ])
        .then((answer) => {
            switch (answer.whatDo) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    break;
            }
        })
}

function viewEmployees() {

}

function addEmployee() {
    
}

function updateEmployee() {

}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', function (err, results) {
        console.table(results)
    })
}

function addRole() {

}

function viewDepartments() {

}

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`); 
    init();
})
