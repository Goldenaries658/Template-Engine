const inquirer = require('inquirer');
const header = require('./Header');

// Function to display employee details
const displayInfo = async (employee) => {
  console.clear();
  console.log(
    '---------------------------------------------------------------'.bold.green
  );
  console.log(employee.getRole().blue.bold);
  console.log('Name: '.bold + employee.name.blue.bold);
  console.log('ID: '.bold + employee.id.blue.bold);
  console.log('Email: '.bold + employee.email.blue.bold);
  if ('officeNumber' in employee) {
    console.log('Office Number: '.bold + employee.officeNumber.blue.bold);
  } else if ('github' in employee) {
    console.log('GitHub: '.bold + employee.github.blue.bold);
  } else {
    console.log('School: '.bold + employee.school.blue.bold);
  }
  console.log(
    '---------------------------------------------------------------'.bold.green
  );
};

// Function to confirm user input
const confirmSelection = async (employee) => {
  console.clear();
  console.log(header);
  // Displaying selected info
  displayInfo(employee);
  const selection = await inquirer.prompt({
    type: 'list',
    name: 'selection',
    message: 'Do you want to save this?'.red,
    choices: ['Yes', 'No'],
  });

  if (selection.selection === 'Yes') {
    return true;
  } else {
    console.clear();
    console.log('Re-enter details:'.magenta.bold);
    return false;
  }
};

// Checking for extra employees
const confirmEmployees = async (employeeList) => {
  console.clear();
  console.log(header);
  employeeList.forEach((employee) => {
    displayInfo(employee);
  });
  const selection = await inquirer.prompt({
    type: 'list',
    name: 'selection',
    message: 'Are you done adding employees? (This will write the html file)'
      .red,
    choices: ['Yes', 'No'],
  });

  if (selection.selection === 'Yes') {
    return true;
  } else {
    return false;
  }
};

module.exports = { confirmSelection, confirmEmployees };
