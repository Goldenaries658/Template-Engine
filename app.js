const fs = require('fs');
const header = require('./lib/Header');

const outputPath = `${__dirname}/output/team.html`;

const render = require('./lib/htmlRenderer');
const createEmployee = require('./lib/createEmployee');
const { confirmSelection, confirmEmployees } = require('./lib/inputConfirm');

const createTeam = async () => {
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
