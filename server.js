/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Abhi Vishalkumar Joshi_________ Student ID: _146463203______ Date: _6/3/2022___________
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

  
  app.get("/departments", function(req,res){
    dataservice.getDepartments(req.params.value).then((data) => {
      res.render("departments", {departments: data});
  }).catch((err) => {
    res.render("departments", {message: "no results"});
  });
  });

  // Employees 
  app.get("/employees", (req, res) => {
    comnsole.log("req.query.status")
    if (req.query.status) {
       dataservice.getEmployeeByStatus(req.query.status).then((data) => {
          res.render("employees",{employees: data});
        }).catch((err) => {
          res.render( {message: "no results"});
        })
    }
    else if (req.query.department) {
        dataservice.getEmployeesByDepartment(req.query.department).then((data) => {
          res.render("employees",{employees: data});
        }).catch((err) => {
          res.render({message: "no results"});
        })
    }
    else if (req.query.manager) {
        dataservice.getEmployeesByManager(req.query.manager).then((data) => {
          res.render("employees",{employees: data});
        }).catch((err) => {
          res.render({message: "no results"});
        })
    }
    else {
        dataservice.getAllEmployees().then((data) => {
          res.render("employees",{employees: data});
        }).catch((err) => {
          res.render({message: "no results"});
        })
    }
  });
  
  app.get('/employee/:value', (req,res) => {
    dataservice.getEmployeeByNum(req.params.value).then((data) => {
      res.render("employee",{employee: data[0]});
    }).catch((err) => {
      res.render("employee", {message: "no results"});
    })
  });
  
  app.get('/employees/add',(req,res) => {
   res.render(path.join(__dirname + "/views/addEmployee.hbs"));
  });
  
  app.post('/employees/add', (req,res) => {
    const formelements = req.body
    dataservice.addEmployee(formelements).then(() => {
        res.redirect("/employees");
    })
  });
  
  
 

  app.post("/employee/update", (req, res) => {
    const form = req.body
    dataservice.updateEmployee(form).then(() => {
    res.redirect("/employees");
    })
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


