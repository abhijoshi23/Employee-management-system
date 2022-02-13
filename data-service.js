var path = require('path');
var fs = require('fs');

var employees = [];
var departments = [];

module.exports.initialize = (() =>{
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "./data/employees.json"), "utf8", (err, data) => {
        if (err) { 
            reject("unable to read file");
        }
        else {
            employees = JSON.parse(data);``

            fs.readFile(path.join(__dirname, "./data/departments.json"), "utf8", (err, data) => {
                if (err) {
                    reject("unable to read file");
                }
                else {
                    departments = JSON.parse(data);

                    resolve();
                }                    
            });
        }
    });
});
});

module.exports.getAllEmployees = (() => {
  return new Promise((resolve, reject) => {
    if (employees.length != 0) {
      resolve(employees)
    }
    else{
      reject("no results returned")
    }
  });
});

module.exports.getManagers = (() => {
  return new Promise((resolve, reject) => {
      let Managers = [];

      employees.forEach((employees) => {
          if (employees.isManager == true){
             Managers.push(employees);
          }
      });
      if (Managers.length != 0) {
        resolve(Managers)
      }
      else{
        reject("no results returned")
      }
  });
});


module.exports.getDepartments = (() => {
  return new Promise((resolve, reject) => {
    if (departments.length != 0) {
      resolve(departments)
    }
    else{
      reject("no results returned")
    }
  });
});

