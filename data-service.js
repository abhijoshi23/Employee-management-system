const Sequelize = require('sequelize');

var sequelize = new Sequelize('dd0r7s9ul2n4be', 'pasfvpvhgmjiik', 'e6b70939ff8bb6b9a044b175493e82830ddaa55dbd11e8852ccb1832157055a2', {
  host: 'ec2-34-238-37-113.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
  ssl: { rejectUnauthorized: false }
  }
 });

 const Employee = sequelize.define('employee', {
  employeeNum: {
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true
  },
  firstName:Sequelize.STRING,
  lastName:Sequelize.STRING,
  email:Sequelize.STRING,
  SSN:Sequelize.STRING,
  addressStreet:Sequelize.STRING,
  addressCity:Sequelize.STRING,
  addressState:Sequelize.STRING,
  addressPostal:Sequelize.STRING,
  maritalStatus:Sequelize.STRING,
  isManager:Sequelize.BOOLEAN,
  employeeManagerNum:Sequelize.INTEGER,
  status:Sequelize.STRING,
  department:Sequelize.INTEGER,
  hireDate:Sequelize.STRING
});


const Department = sequelize.define('department', {
  departmentId: {
      type:Sequelize.INTEGER,
      primaryKey:true,
      autoIncrement:true
  },
  departmentName:Sequelize.STRING
})

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = (() =>{
  return new Promise((resolve,reject) => {
    sequelize.sync()
    .then(resolve('database synced'))
    .catch(reject('unable to sync the database'));
})
})


module.exports.getAllEmployees = (() => {
  return new Promise(function (resolve, reject) {
    sequelize.sync()
    .then(resolve(Employee.findAll()))
    .catch(reject('no results returned'));
   });
  });

module.exports.getEmployeeByStatus = (status) => {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where:{
          status: status
        }
    })
    .then(resolve(Employee.findAll({ where: { status: status }})))
    .catch(reject('no results returned'))
     });
    }

 module.exports.getEmployeesByDepartment = (department) => {
        return new Promise((resolve,reject) => {
          Employee.findAll({
              where: {
                  department:department
              }
          })
          .then(data => resolve(data))
          .catch(err => reject(err))
      });
 }
  
 module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve,reject) => {
      Employee.findAll({
          where: {
              employeeManagerNum: manager
          }
      })
      .then(resolve(Employee.findAll({ where: { employeeManagerNum: manager }})))
      .catch(reject('no results returned'))
   });
  }

  module.exports.getEmployeeByNum = (value) => {
    return new Promise((resolve,reject) => {
      Employee.findAll({
          where: {
              employeeNum:value
          }
      })
      .then(data => resolve(data))
      .catch('no results returned')
     });
    }

module.exports.getManagers = (() => {
  return new Promise((resolve,reject) => {
    Employee.findAll({
        where: {
            isManager:true
        }
    })
    .then(resolve(Employee.findAll({ where: { isManager: true }})))
    .catch('no results returned')
})
  });

module.exports.getDepartments = (() => {
  return new Promise((resolve, reject) => {
    Department.findAll()
    .then(data => { resolve(data); })
    .catch(err => { reject(err); })
}) 
  });


module.exports.addEmployee = (employeeData) => {
  return new Promise((resolve,reject) => {
    employeeData.isManager = Employee.isManager ? true : false;
    for (var i in Employee) {
        if (Employee[i] == "") { Employee[i] = null; }
    }

    Employee.create(employeeData)
    .then(resolve(Employee.findAll()))
    .catch(reject('unable to create employee'))
})
  }

  exports.addDepartment = (departmentData) => {
    return new Promise((resolve,reject) => {
        for (var i in departmentData) {
            if (departmentData[i] == "") { departmentData[i] = null; }
        }

        Department.create(departmentData)
        .then(resolve(Department.findAll()))
        .catch(reject('unable to add department'))
    })
};

exports.getDepartmentById = id => {
  return new Promise((resolve,reject) => {
      Department.findAll({ 
          where: {
              departmentId: id
          }
      })
      .then(resolve(Department.findAll({ where: { departmentId: id }})))
      .catch(reject('no results returned'))
  })
};

exports.deleteDepartmentById = id => {
  return new Promise((resolve,reject) => {
      Department.destroy({
          where: {
              departmentId: id
          }
      })
      .then(resolve())
      .catch(reject('unable to delete employee'))
  })
};

exports.deleteEmployeeByNum = num => {
  return new Promise((resolve,reject) => {
      Employee.destroy({
          where: {
              employeeNum: num
          }
      })
      .then(resolve())
      .catch(reject('unable to delete employee'))
  })
};

exports.updateDepartment = (departmentData) => {
  return new Promise((resolve,reject) => {
      for (var i in departmentData) {
          if (departmentData[i] == "") { departmentData[i] = null; }
      }

      sequelize.sync()
      .then(Department.update(departmentData, {where: { 
          departmentId: departmentData.departmentId
      }}))
      .then(resolve(Department.update(departmentData, {where: { departmentId:departmentData.departmentId }})))
      .catch(reject('unable to update department'))
  })
};

module.exports.updateEmployee = (employeeData) => {
  return new Promise((resolve,reject) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for (var i in employeeData) {
        if (employeeData[i] == "") { employeeData[i] = null; }
    }

    sequelize.sync()
    .then(Employee.update(employeeData, {where: {
        employeeNum: employeeData.employeeNum
    }}))
    .then(resolve(Employee.update(employeeData, { where: { employeeNum:employeeData.employeeNum }})))
    .catch(reject('unable to update employee'))
})
  }
  
