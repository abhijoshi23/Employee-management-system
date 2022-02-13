var express = require("express");
var app = express();
var path = require('path');
var dataservice = require(path.join(__dirname, "./data-service.js"));

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/index", function(req,res){
    res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });


app.get("/employees", function(req,res){
  dataservice.getAllEmployees()
    .then((employees) => {
      res.json(employees);
  }).catch((err) => {
      console.log(err);
  });
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


