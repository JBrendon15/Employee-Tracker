// import neccessary packages
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cTable = require('console.table');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;

// middleware needed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connecting server.js to mysql databases
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employeetracker_db'
    },
);
// function to take user input on what they would like to do with switch cases
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
// function to display list of all employees
function viewEmployees() {
    db.query(`SELECT employee.id, first_name, last_name, title, department.name AS department, salary, CONCAT(employee.first_name ,' ', employee.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id`, function (err, results) {
        if(err) {
            console.log(err);
        }
        console.table(results);
        init();
    });
}

function addEmployee() {
    
}

function updateEmployee() {

}
// function to display all roles 
function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', function (err, results) {
        if(err) {
            console.log(err);
        }
        console.table(results);
        init();
    });
}

function addRole() {

}
// function to view all departments
function viewDepartments() {
    db.query('SELECT name AS departments FROM department', function (err, results) {
        if(err) {
            console.log(err);
        }
        console.table(results);
        init();
    })
}

function addDepartment() {
    
}

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`); 
    init();
})
