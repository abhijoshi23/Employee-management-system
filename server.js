/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Abhi Vishalkumar Joshi_________ Student ID: _146463203______ Date: _13/2/2022___________
*
* Online (Heroku) Link: ___https://web322-app-abhi.herokuapp.com/_____________________________________________________
*
********************************************************************************/ 
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


