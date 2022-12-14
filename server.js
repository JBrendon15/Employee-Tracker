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
                    console.log('Goodbye!');
                    // googled how to exit out of a running script in nodejs
                    process.exit();
                    
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
// function to add an employee
function addEmployee() {
    let employeesArr = [];
    let rolesArr = [];
    db.query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee`, function(err, results) {
        if(err) {
            console.log(err);
        }
        for(let i = 0; i < results.length; i++){
            employeesArr.push(results[i].name)
        }
        db.query(`SELECT title FROM role`, function(err, results) {
            if(err) {
                console.log(err);
            }
            for(let i = 0; i < results.length; i++) {
                rolesArr.push(results[i].title)
            }
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: `What is the employee's first name?`,
                        name: 'newFirst'
                    },
                    {
                        type: 'input',
                        message: `What is the employee's last name?`,
                        name: 'newLast'
                    },
                    {
                        type: 'list',
                        message: `What is the employee's role?`,
                        choices: rolesArr,
                        name: 'newRole'
                    },
                    {
                        type: 'list',
                        message: `Who is the employee's manager?`,
                        choices: employeesArr,
                        name: 'employeeManager'
                    }
                ])
                .then((answer) => {
                    db.query(`SELECT id FROM role WHERE title = '${answer.newRole}'`, 
                    function(err,results) {
                        if(err) {
                            console.log(err);
                        }
                        let newRole = results[0].id;
                        db.query(`SELECT id FROM employee WHERE first_name = '${answer.employeeManager.split(' ')[0]}' AND last_name = '${answer.employeeManager.split(' ')[1]}' `,
                        function(err, results) {
                            if(err) {
                                console.log(err);
                            }
                            let newManager = results[0].id;
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.newFirst}', '${answer.newLast}', ${newRole}, ${newManager})`)
                            init();
                        })
                    })
                })
        })
    });
}
// function to update an employee role
function updateEmployee() {
    let employees = [];
    let roles = [];
    db.query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee`, function(err, results) {
        if(err) {
            console.log(err);
        }
        for(let i = 0; i < results.length; i++){
            employees.push(results[i].name)
        }
        db.query(`SELECT title FROM role`, function(err, res) {
            if(err) {
                console.log(err);
            }
            for(let i = 0; i < res.length; i++) {
                roles.push(res[i].title)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: `Which employee would you like to update?`,
                        choices: employees,
                        name: 'selectedEmployee'
                    },
                    {
                        type: 'list',
                        message: `What would you like to change their role to?`,
                        choices: roles,
                        name: 'newRole'
                    }
                ])
                .then((answers) => {
                    db.query(`SELECT id from employee WHERE first_name = '${answers.selectedEmployee.split(' ')[0]}' AND last_name = '${answers.selectedEmployee.split(' ')[1]}'`, function(err, results) {
                        if(err) {
                            console.log(err);
                        }
                        let employeeId = results[0].id;
                        db.query(`SELECT id from role WHERE title = '${answers.newRole}'`, function(err, results) {
                            if(err) {
                                console.log(err);
                            }
                            let newRoleId = results[0].id;
                            db.query(`UPDATE employee SET role_id = ${newRoleId} WHERE id = ${employeeId}`)
                            init();
                        })
                    })
                })
        })
    });
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
        if(err){
            console.log(err);
        }
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
// confirms a connection is made with mysql servers and starts application
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`); 
    init();
})


