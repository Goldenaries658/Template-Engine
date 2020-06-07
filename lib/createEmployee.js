const inquirer = require('inquirer');
const Manager = require('./Manager');
const Engineer = require('./Engineer');
const Intern = require('./Intern');

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

module.exports = createEmployee;
