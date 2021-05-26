// Declaring modules for later use
const inquirer = require("inquirer");
const mysql = require("mysql");
const { printTable } = require("console-table-printer");

// Setting up connection with mysql
var connection = mysql.createConnection({
  host: "127.0.0.1",

  port: 3306,

  user: "root",

  // Add your mysql password
  password: "",

  database: "employee_db",
});

// Starting connection with mysql
connection.connect((err) => {
  if (err) throw err;

  startPrompt();
});

// The function for starting the prompt and asking questions
startPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do? ",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit Prompt",
        ],
        name: "userChoice",
      },
    ])
    .then((data) => {
      // Determine user selection and run function to complete prompt
      switch (data.userChoice) {
        case "View All Employees":
          viewEmp();
          break;
        case "View All Employees By Department":
          viewEmpDep();
          break;
        case "View All Employees By Manager":
          viewEmpMan();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Remove Employee":
          removeEmp();
          break;
        case "Update Employee Role":
          updateEmpRole();
          break;
        case "Update Employee Manager":
          updateEmpMan();
          break;
        case "Exit Prompt":
          connection.end();
          break;
      }
    });
};

// Function for viewing all employees
viewEmp = () => {
  // query the data base for all three table data
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
    (err, results) => {
      if (err) throw err;

      console.log("\n");
      printTable(results);
    }
  );
  startPrompt();
};

// Function for viewing all employees by department
viewEmpDep = () => {
  // query the data base for all three table data
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
    (err, results) => {
      if (err) throw err;

      inquirer
        .prompt({
          type: "list",
          message: "Select the department: ",
          choices: ["Engineering", "Sales", "Finance", "Legal"],
          name: "userChoice",
        })
        .then((data) => {
          // Determine uster selection
          switch (data.userChoice) {
            case "Engineering":
              // Find rows with engineer
              for (i = 0; i < results.length; i++) {
                if (results[i].dep_name !== "Engineering") {
                  results.splice([i], 1);
                }
              }

              console.log("\n");
              printTable(results);
              startPrompt();
              break;
            case "Sales":
              for (i = 0; i < results.length; i++) {
                if (results[i].dep_name !== "Sales") {
                  results.splice([i], 1);
                }
              }

              console.log("\n");
              printTable(results);
              startPrompt();
              break;
            case "Finance":
              for (i = 0; i < results.length; i++) {
                if (results[i].dep_name !== "Finance") {
                  results.splice([i], 1);
                }
              }

              console.log("\n");
              printTable(results);
              startPrompt();
              break;
            case "Legal":
              for (i = 0; i < results.length; i++) {
                if (results[i].dep_name !== "Legal") {
                  results.splice([i], 1);
                }
              }

              console.log("\n");
              printTable(results);
              startPrompt();
              break;
          }
        });
    }
  );
};

// Function for viewing all employees by manager
viewEmpMan = () => {
  // query the data base for all three table data
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
    (err, results) => {
      if (err) throw err;

      inquirer
        .prompt({
          type: "list",
          message: "Select by Manager ID: ",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].manager_id);
            }
            return choiceArray;
          },
          name: "userChoice",
        })
        .then((data) => {
          // Match manager id's
          for (i = 0; i < results.length; i++) {
            if (parseInt(data.userChoice) !== parseInt(results[i].manager_id)) {
              results.splice([i], 1);
            }
          }

          console.log("\n");
          printTable(results);
          startPrompt();
        });
    }
  );
};

// Function for adding an employee
addEmp = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the new employee's first name: ",
        name: "first_name",
      },
      {
        type: "input",
        message: "Enter the new employee's last name: ",
        name: "last_name",
      },
      {
        type: "input",
        message: "Enter the new employee's role id: ",
        name: "role_id",
      },
      {
        type: "input",
        message: "Enter the new employee's manager id: ",
        name: "manager_id",
      },
      {
        type: "input",
        message: "Enter the new employee's title: ",
        name: "title",
      },
      {
        type: "input",
        message: "Enter the new employee's salary: ",
        name: "salary",
      },
      {
        type: "input",
        message: "Enter the new employee's department id: ",
        name: "department_id",
      },
      {
        type: "input",
        message: "Enter the new employee's department name: ",
        name: "dep_name",
      },
    ])
    .then((response) => {
      // query the data base for all three table data
      connection.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.first_name}","${response.last_name}",${response.role_id},${response.manager_id})`,
        (err, results) => {
          if (err) throw err;

          connection.query(
            `INSERT INTO role (title, salary, department_id) VALUES ("${response.title}",${response.salary},${response.department_id})`,
            (err, results) => {
              if (err) throw err;

              connection.query(
                `INSERT INTO department (dep_name) VALUES ("${response.dep_name}")`,
                (err, results) => {
                  if (err) throw err;

                  connection.query(
                    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
                    (err, results) => {
                      if (err) throw err;
                      printTable(results);
                      startPrompt();
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
};

// Function for removing an employee
removeEmp = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
    (err, results) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "list",
            message:
              "Select the employee you wish to remove from the database: ",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                let fullNames =
                  results[i].first_name + " " + results[i].last_name;
                choiceArray.push(fullNames);
              }
              return choiceArray;
            },
            name: "rmEmp",
          },
        ])
        .then((response) => {
          let name = response.rmEmp;
          let array = name.split(" ");
          connection.query(
            `DELETE FROM employee WHERE first_name="${array[0]}"`,
            (err, results) => {
              if (err) throw err;

              connection.query(
                "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
                (err, response) => {
                  if (err) throw err;

                  console.log("\n");
                  printTable(response);
                  startPrompt();
                }
              );
            }
          );
        });
    }
  );
};

// Function for updating employee role
updateEmpRole = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
    (err, results) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "list",
            message:
              " Select the employee whose role you would like to update: ",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                let fullNames =
                  results[i].first_name +
                  " " +
                  results[i].last_name +
                  " ID " +
                  results[i].id;
                choiceArray.push(fullNames);
              }
              return choiceArray;
            },
            name: "updEmpRole",
          },
        ])
        .then((response) => {
          inquirer
            .prompt({
              type: "input",
              message: "Input new role: ",
              name: "newRole",
            })
            .then((response1) => {
              let name = response.updEmpRole;
              let array = name.split(" ");

              connection.query(
                `UPDATE role SET title = "${response1.newRole}" WHERE id = "${array[3]}"`,
                (err, results) => {
                  if (err) throw err;

                  connection.query(
                    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
                    (err, response2) => {
                      if (err) throw err;

                      console.log("\n");
                      printTable(response2);
                      startPrompt();
                    }
                  );
                }
              );
            });
        });
    }
  );
};

// Function for updating employee manager
updateEmpMan = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
    (err, results) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "list",
            message:
              " Select the employee whose manager you would like to update: ",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                let fullNames =
                  results[i].first_name +
                  " " +
                  results[i].last_name +
                  " ID " +
                  results[i].id;
                choiceArray.push(fullNames);
              }
              return choiceArray;
            },
            name: "updEmpMan",
          },
        ])
        .then((response) => {
          inquirer
            .prompt({
              type: "input",
              message: "Input new manager id: ",
              name: "newMan",
            })
            .then((response1) => {
              let name = response.updEmpMan;
              let array = name.split(" ");

              connection.query(
                `UPDATE employee SET manager_id = "${response1.newMan}" WHERE id = "${array[3]}"`,
                (err, results) => {
                  if (err) throw err;

                  connection.query(
                    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name FROM (employee JOIN role ON employee.id = role.id)JOIN department ON employee.id = department.id",
                    (err, response2) => {
                      if (err) throw err;

                      console.log("\n");
                      printTable(response2);
                      startPrompt();
                    }
                  );
                }
              );
            });
        });
    }
  );
};
