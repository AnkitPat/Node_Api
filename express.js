const express = require('express')
const app = express();
require('./models/task.model');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
const api = require('./operation/index')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var server = app.listen(8000, () => {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening on port 8000!', host, port)
});

app.post('/createTask', (req, res) => {
  api.insertInDB(req, res)
})

app.get('/getAll', (req, res) => {
  api.getAllTask(req, res)
})

app.delete('/deleteTask', (req, res) => {
  api.deleteAllTask(req, res)
})

app.put('/updateTaskName/:taskId', (req, res) => {
  api.updateTaskName(req, res)
})


app.put('/updateProjectName/:taskId', (req, res) => {
  api.updateProjectName(req, res)
})

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, (err) => {
  if (!err) {
    console.log('Successfully Established Connection with MongoDB')
  }
  else {
    console.log('Failed to Establish Connection with MongoDB with Error: ' + err)
  }
});

//Connecting Node and MongoDB