DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dep_name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INT NOT NULL
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
);

INSERT INTO department(dep_name) VALUES("Engineering"),("Sales"),("Engineering"),("Finance"),("Software Development");

INSERT INTO role(title, salary, department_id) VALUES("Engineer", 90000, 11),("Sales Rep", 50000, 21),("Engineer", 100000, 11),("Accountant", 57000, 31);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("John", "Doe", 111, 101),("Sally","Low",112,102),("Bob", "Dowry", 113, 101),("Tom", "Smith", 114, 103);



SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.dep_name
FROM (employee JOIN role ON employee.id = role.id)
	JOIN department ON employee.id = department.id;