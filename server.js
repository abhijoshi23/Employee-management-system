/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Abhi Vishalkumar Joshi_________ Student ID: _146463203______ Date: 27/3/2022___________
*
* Online (Heroku) Link: https://fast-river-50640.herokuapp.com
*
********************************************************************************/ 
var express = require("express");
var app = express();
var parse = require("body-parser")
var exphbs = require("express-handlebars")
var multer = require("multer")
var fs = require('fs');
var path = require('path');
let dataservice = require( "./data-service.js");

var HTTP_PORT = process.env.PORT || 8080;


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));

app.engine('.hbs', exphbs.engine({ 
  extname:'.hbs', 
  defaultLayout: 'main',
  helpers:{
    navLink:function(url, options){
        return '<li' + ((url==app.locals.activeRoute)? ' class="active"':'')
            +'><a href="'+url+'">'+options.fn(this)+'</a></li>'
    },
    equal:function(lvalue, rvalue, options){
        if(arguments.length<3)
            throw new Error("Handlerbars Helper equal needs 2 parameters");
        if(lvalue != rvalue){
            return options.inverse(this);
        }else{
            return options.fn(this);
        }
    }
  }
}));
app.set("view engine", ".hbs");


app.use(express.static('public'));
app.use(parse.urlencoded({extended:true}));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });
 

app.get("/",(req,res)=>{
   // res.sendFile(path.join(__dirname, "./views/index.html"));
   res.render("home");
});

app.get("/index", function(req,res){
    //res.sendFile(path.join(__dirname, "./views/index.html"));
    res.render("home");
});

app.get("/about", (req,res)=>{
   // res.sendFile(path.join(__dirname,"/views/about.html"));
   res.render("about");
  });

 
app.get("/images/add",(req,res)=>{
 // res.status(200).sendFile(path.join(__dirname, "./views/addImage.html"));
 res.render(path.join(__dirname + "/views/addImage.hbs"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", function(req,res){
  fs.readdir("./public/images/uploaded", function(err,data) {
    res.render("images", { data: data});
})
});


  app.get("/managers", function(req,res){
    dataservice.getManagers()
    .then((Managers) => {
      res.json(Managers);
  }).catch((err) => {
      res.json("{ Message:" +err+ "}");
  });
  });

  

  // Employees 
  app.get("/employees", (req, res) => {
    if (req.query.status) {
      dataservice.getEmployeeByStatus(req.query.status)
      .then(data => res.render("employees", { employees: data }))
      .catch(err => res.status(404).send('no results'))
  }
  else if (req.query.department) {
      dataservice.getEmployeesByDepartment(req.query.department)
      .then(data => res.render("employees", { employees: data }))
      .catch(err => res.status(404).send('no results'))
  }
  else if (req.query.manager) {
      dataservice.getEmployeesByManager(req.query.manager)
      .then(data => res.render("employees", { employees: data }))
      .catch(err => res.status(404).send('no results'))
  }
  else {
      dataservice.getAllEmployees()
      .then(data => res.render("employees", { employees: data }))
      .catch(err => res.status(404).send('no results'))
  }
  });
  

  app.get("/employee/:empNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    dataservice.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error 
    }).then(dataservice.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"

        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching 
        // viewData.departments object

        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
  });

  app.get('/employees/delete/:empNum', (req,res) => {
    dataservice.deleteEmployeeByNum(req.params.empNum)
    .then(res.redirect("/employees"))
    .catch(err => res.status(500).send("Unable to Remove Employee / Employee not found"))
});

  app.get('/employee/:value', (req,res) => {
    dataservice.getEmployeeByNum(req.params.value).then((data) => {
      res.render("employee",{employee: data[0]});
    }).catch((err) => {
      res.render("employee", {message: "no results"});
    })
  });
  
  app.get('/employees/add',(req,res) => {
    dataservice.getDepartments()
    .then(data => res.render("addEmployee", {departments: data}))
    .catch(err => res.render("addEmployee", {departments: []}));
});

app.post('/employees/add', (req,res) => {
    dataservice.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    })
});
  
  
 

  app.post("/employee/update", (req, res) => {
    const form = req.body
    dataservice.updateEmployee(form).then(() => {
    res.redirect("/employees");
    })
   });

// Departments

app.get("/departments", (req, res) => {
  dataservice.getDepartments()
  .then(data => res.render("departments", { departments: data }))
  .catch(err => res.status(404).send('departments not found'))
});

app.get("/departments/add", (req,res) => {
    res.render(path.join(__dirname + "/views/addDepartment.hbs"));
});

app.post("/departments/add", (req,res) => {
    dataservice.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});

app.post("/department/update", (req,res) => {
    dataservice.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});

app.get("/department/:departmentId", (req, res) =>{
    dataservice.getDepartmentById(req.params.departmentId)
    .then((data) => {res.render("department", { department: data })})
    .catch(err => res.status(404).send("department not found"))
});

app.get('/departments/delete/:departmentId', (req,res) => {
  dataservice.deleteDepartmentById(req.params.departmentId)
  .then(res.redirect("/departments"))
  .catch(err => res.status(500).send("Unable to Remove Department / Department not found"))
});
   

  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"/views/404page.html"));
  });

  dataservice.initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart);
  })
 .catch((err) => {
    console.log(err);
  });


