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


exports.addEmployee = (employeeData) => {
  employeeData.isManager==undefined ? employeeData.isManager = false : employeeData.isManager = true;
  employeeData.employeeNum = emp.length + 1;
  emp.push(employeeData);
  return new Promise((resolve,reject) => {
    if (emp.length == 0) {
        reject ('no results');
    }
    else {
        resolve(emp);
    }
})
};

exports.getEmployeeByStatus = (status) => {
  return new Promise((resolve,reject) => {
      var employee_status = emp.filter(emp => emp.status == status);
      if (employee_status.length != 0) {
        resolve(employee_status);
      }
      reject('no results');    
  })
};

exports.getEmployeesByDepartment = (department) => {
  return new Promise ((resolve,reject) => {
      var employee_department = emp.filter(emp => emp.department == department);        
      if (employee_department.length != 0) {
        resolve(employee_department);
      }
      reject ('department not found');
  })
};

exports.getEmployeesByManager = (manager) => {
  return new Promise ((resolve,reject) => {
      var employee_manager = emp.filter(emp => emp.employeeManagerNum == manager);
      if (employee_manager.length != 0) {
        resolve(employee_manager);
      }
      reject('manager not found');
  })
};

exports.getEmployeeByNum = (value) => {
  return new Promise((resolve,reject) => {
      var employee_num = emp.filter(emp => emp.employeeNum == value);
      if (employee_num.length != 0) {
        resolve(employee_num);
      } 
      reject('no employee found');
  })
}
  

exports.updateEmployee = (employeeData) => {
  return new Promise ((resolve,reject) => {
      emp.forEach((aj) => {
          if (aj.employeeNum == employeeData.employeeNum) {
              emp.splice(employeeData.employeeNum-1, 1, employeeData);
              resolve();
          }
      })
  })
};
  







