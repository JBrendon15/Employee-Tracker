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
    db.query(`SELECT employee1.id, employee1.first_name, employee1.last_name, title, department.name AS department, salary, CONCAT(employee2.first_name ,' ', employee2.last_name) AS manager FROM employee AS employee1 JOIN role ON employee1.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS employee2 ON employee1.manager_id = employee2.id`, function (err, results) {
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
    // UPDATE employee
    // SET role_id = 3
    // WHERE id = 5;
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
// function to add a new role
function addRole() {
    let departNames = [];
    db.query('SELECT name FROM department', function(err,results) {
        for(let i = 0; i < results.length; i++) {
            departNames.push(results[i].name)
        }
    })
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What role do you want to add?',
                name: 'newRole'
            },
            {
                type: 'number',
                message: 'What is the salary of this role?',
                name: 'newSalary',
            },
            {
                type: 'list',
                message: 'What department will this role be in?',
                choices: departNames,
                name: 'whichDepartment'
            }

        ])
        .then((answer) => {
            db.query(`SELECT id FROM department WHERE name = '${answer.whichDepartment}'`, function(err, results) {
                if (err) {
                    console.log(err);
                }
                let departId = results[0].id
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.newRole}', ${answer.newSalary}, ${departId})`, function(err, results) {
                    if(err) {
                        console.log(err);
                    }
                    console.log('successfully added')
                    init();

                })
            })
        })
}
// function to view all departments
function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if(err) {
            console.log(err);
        }
        console.table(results);
        init();
    })
}
// function to add a new department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What department would you like to add?',
                name: 'newDepart'
            }
        ])
        .then((answer) => {
            db.query(`INSERT INTO department (name) VALUE ('${answer.newDepart}')`, function (err, results) {
                if (err) {
                    console.log(err)
                }
                init();
            })
        })
}

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`); 
    init();
})


