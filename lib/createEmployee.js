const inquirer = require('inquirer');
const Manager = require('./Manager');
const Engineer = require('./Engineer');
const Intern = require('./Intern');

const emailValidator = async (email) => {
  valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

  if (valid) {
    return true;
  } else {
    console.clear();
    printHeader();
    console.log('Invalid email entered!'.red.bold);
    return false;
  }
};

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
  let currentEmployee = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: `Enter ${role}'s name:`,
  });
  const name = currentEmployee.name;

  // Array of personalised questions using name
  const questions = {
    id: {
      name: 'id',
      message: `Enter ${name}'s ID:`,
    },
    email: {
      name: 'email',
      message: `Enter ${name}'s email:`,
      validate: emailValidator,
    },
    officeNumber: {
      type: 'number',
      name: 'officeNumber',
      message: `Enter ${name}'s Office Number:`,
    },
    gitHub: {
      name: 'gitHub',
      message: `Enter ${name}'s GitHub:`,
    },
    school: {
      name: 'school',
      message: `Enter ${name}'s school:`,
    },
  };
  try {
    // Setting id and email
    const id = (await inquirer.prompt(questions.id)).id;
    const email = (await inquirer.prompt(questions.email)).email;

    // Asking specific questions based on type
    switch (role) {
      case 'manager':
        const officeNumber = (await inquirer.prompt(questions.officeNumber))
          .officeNumber;
        employee = new Manager(name, id, email, officeNumber);
        break;
      case 'engineer':
        const gitHub = (await inquirer.prompt(questions.gitHub)).gitHub;
        employee = new Engineer(name, id, email, gitHub);
        break;
      case 'intern':
        const school = (await inquirer.prompt(questions.school)).school;
        employee = new Intern(name, id, email, school);
        break;
      default:
        throw new Error("I don't know how but you picked an invalid option");
    }
    return employee;
  } catch (error) {
    console.error(error);
  }
};

module.exports = createEmployee;
