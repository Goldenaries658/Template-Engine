const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const header = require('./lib/Header');

const OUTPUT_DIR = path.resolve(__dirname, '/output');
const outputPath = path.join(OUTPUT_DIR, '/team.html');

const render = require('./lib/htmlRenderer');
const createEmployee = require('./lib/createEmployee')

const createTeam = async () => {
  // Function to display employee details
  const displayInfo = async (employee) => {
    console.clear()
    console.log(
      '---------------------------------------------------------------'.bold
        .green
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
      '---------------------------------------------------------------'.bold
        .green
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

  const teamArray = [];
  // Entering manager details
  console.clear();
  console.log(header);
  console.log('First, enter in manager details:'.magenta.bold);
  let managerChosen = false;
  let manager;
  while (!managerChosen) {
    manager = await createEmployee('manager');
    managerChosen = await confirmSelection(manager);
  }
  // Pushing confirmed manager to team array
  teamArray.push(manager);

  // Entering employee details
  console.clear();
  console.log(header);
  console.log('Next add a team member:'.magenta.bold);

  // Nested while loop allows infinite number of employees to be entered whilst still
  // checking for validity
  let employeeListComplete = false;
  while (!employeeListComplete) {
    let employeeChosen = false;
    while (!employeeChosen) {
      const employee = await createEmployee();
      employeeChosen = await confirmSelection(employee);
    }
    // Pushing confirmed employee to team array
    teamArray.push(employee);
    // Confirming whether list is complete
    employeeListComplete = await confirmEmployees(teamArray);
  }
  console.clear();
  console.log(header);
  console.log('Writing File!'.magenta.bold);
  fs.writeFile(outputPath, render(teamArray), (err) => {
    if (err) {
      throw err;
    }
    console.log('Done!'.magenta.bold);
  });
};
createTeam();
