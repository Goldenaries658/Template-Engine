const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const render = require('./lib/htmlRenderer');

const roleSelector = async () => {
  const roles = ['Engineer', 'Intern'];
  const queryRole = await inquirer.prompt({
    type: 'list',
    name: 'role',
    message: 'What type of employee do you want to add?',
    choices: roles,
  });
  const role = queryRole.role.toLowerCase();
  return role;
};

const createEmployee = async (role) => {
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

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!``
