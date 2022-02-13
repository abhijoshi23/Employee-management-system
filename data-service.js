var path = require('path');
var fs = require('fs');

var emp = [];
var depart = [];

module.exports.initialize = (() =>{
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "./data/employees.json"), "utf8", (err, data) => {
        if (err) { 
            reject("unable to read file");
        }
        else {
            emp = JSON.parse(data);``

            fs.readFile(path.join(__dirname, "./data/departments.json"), "utf8", (err, data) => {
                if (err) {
                    reject("unable to read file");
                }
                else {
                    depart = JSON.parse(data);

                    resolve();
                }                    
            });
        }
    });
});
});

module.exports.getAllEmployees = (() => {
  return new Promise((resolve, reject) => {
    if (emp.length != 0) {
      resolve(emp)
    }
    else{
      reject("no results returned")
    }
  });
});

module.exports.getManagers = (() => {
  return new Promise((resolve, reject) => {
      let Managers = [];

      emp.forEach((emp) => {
          if (emp.isManager == true){
             Managers.push(emp);
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
    if (depart.length != 0) {
      resolve(depart)
    }
    else{
      reject("no results returned")
    }
  });
});

