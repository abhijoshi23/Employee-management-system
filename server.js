/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Abhi Vishalkumar Joshi_________ Student ID: _146463203______ Date: _20/2/2022___________
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 
var express = require("express");
var app = express();
var parse = require("body-parser")
var multer = require("multer")
var fs = require('fs');
var path = require('path');
var dataservice = require(path.join(__dirname, "./data-service.js"));

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

app.use(express.static('public'));
app.use(parse.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/index", function(req,res){
    res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });

 
app.get("/images/add", function(req,res){
  res.status(200).sendFile(path.join(__dirname, "./views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", function(req,res){
  fs.readdir("./public/images/uploaded", function(err,data) {
    res.json(data);
})
});

app.get("/employees", (req, res) => {
  if (req.query.status) {
      dataservice.getEmployeeByStatus(req.query.status).then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
  else if (req.query.department) {
      dataservice.getEmployeesByDepartment(req.query.department).then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
  else if (req.query.manager) {
      dataservice.getEmployeesByManager(req.query.manager).then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
  else {
      dataservice.getAllEmployees().then((data) => {
          res.json({data});
      }).catch((err) => {
          res.json({message: err});
      })
  }
});

app.get('/employee/:value', (req,res) => {
  dataservice.getEmployeeByNum(req.params.value).then((data) => {
      res.json({data});
  }).catch((err) => {
      res.json({message: err});
  })
});

app.get('/employees/add',(req,res) => {
  res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

app.post('/employees/add', (req,res) => {
  const formelements = req.body
  dataservice.addEmployee(formelements).then(() => {
      res.redirect("/employees");
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
    dataservice.getDepartments()
    .then((departments) => {
      res.json(departments)
  }).catch((err) => {
      console.log(err);
  });
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


