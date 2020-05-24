const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const header = require('./lib/Header');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const render = require('./lib/htmlRenderer');

const roleSelector = async () => {
  const queryRole = await inquirer.prompt({
    type: 'list',
    name: 'role',
    message: 'What type of employee do you want to add?',
    choices: ['Engineer', 'Intern'],
  });
  const role = queryRole.role.toLowerCase();
  return role;
};

const createEmployee = async (role) => {
  if (!role) {
    role = await roleSelector();
  }
  if (role != 'manager' && role != 'engineer' && role != 'intern') {
    throw new Error("I don't know how but you picked an invalid option");
  }
  // Getting employee name
  let name = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: `Enter ${role}'s name:`,
  });
  name = name.name;

  // Array of personalised questions using name
  const questions = {
    id: { type: 'input', name: 'id', message: `Enter ${name}'s ID:` },
    email: {
      type: 'input',
      name: 'email',
      message: `Enter ${name}'s email:`,
    },
    officeNumber: {
      type: 'input',
      name: 'officeNumber',
      message: `Enter ${name}'s Office Number:`,
    },
    gitHub: {
      type: 'input',
      name: 'gitHub',
      message: `Enter ${name}'s GitHub:`,
    },
    school: {
      type: 'input',
      name: 'school',
      message: `Enter ${name}'s school:`,
    },
  };
  try {
    // Setting id and email
    const id = (await inquirer.prompt(questions.id)).id;
    const email = (await inquirer.prompt(questions.email)).email;

    // Asking specific questions based on type
    if (role === 'manager') {
      const officeNumber = (await inquirer.prompt(questions.officeNumber))
        .officeNumber;
      employee = new Manager(name, id, email, officeNumber);
    } else if (role === 'engineer') {
      const gitHub = (await inquirer.prompt(questions.gitHub)).gitHub;
      employee = new Engineer(name, id, email, gitHub);
    } else if (role === 'intern') {
      const school = (await inquirer.prompt(questions.school)).school;
      employee = new Intern(name, id, email, school);
    } else {
      throw new Error("I don't know how but you picked an invalid option");
    }

    return employee;
  } catch (error) {
    console.log(error);
  }
};

const createTeam = async () => {
  // Function to display employee details
  const displayInfo = async (employee) => {
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
  fs.writeFile('team.html', render(teamArray), (err) => {
    if (err) {
      throw err;
    }
    console.log
    console.log('Done!'.magenta.bold);
  });
};
createTeam();
