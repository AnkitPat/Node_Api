const mongoose = require('mongoose');
const Task = mongoose.model('task');
const dateUtils = require('../utils/index')

//Creating function to insert data into MongoDB
function insertIntoMongoDB(req, res) {
    var task = new Task();
    task.taskName = req.body.taskName;
    task.projectName = req.body.projectName;
    task.startTime = req.body.startTime;
    task.endTime = req.body.endTime;
    task.timer = [{
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        duration: dateUtils.timeDifference(req.body.startTime, req.body.endTime)
    }]
    task.duration = dateUtils.timeDifference(req.body.startTime, req.body.endTime)

    Task.find({ taskName: req.body.taskName, projectName: req.body.projectName }, (err, docs) => {
        docs = docs.filter((task1) => {
            if (dateUtils.formatDate(task1.toObject().startTime) === dateUtils.formatDate(req.body.startTime)) return true
            else return false
        })
        if (!err) {
            if (docs.length > 0) {
                const newTask = {
                    ...docs[0].toObject(),
                    timer: docs[0].timer.concat({ startTime: req.body.startTime, endTime: req.body.endTime, duration: dateUtils.timeDifference(req.body.startTime, req.body.endTime) }),
                    endTime: req.body.endTime,
                    duration: dateUtils.addTimes([docs[0].toObject().duration, dateUtils.timeDifference(req.body.startTime, req.body.endTime)])
                }
                Task.findOneAndUpdate({ _id: docs[0].toObject()._id }, newTask, (err, res) => {
                    console.log(err, res)
                })
                res.send("saved")
            } else {
                task.save((err, doc) => {
                    if (!err) {
                        console.log(doc)
                        res.send("Task Inserted");

                    }
                    else
                        console.log('Error during record insertion : ' + err);
                });
            }
        } else {
            task.save((err, doc) => {
                if (!err) {
                    console.log(doc)
                    res.send("Task Inserted");

                }
                else
                    console.log('Error during record insertion : ' + err);
            });
        }
    })



}


//Creating function to update task name of existing
function updateTaskName(req, res) {
    console.log(req.params)
    const taskId = req.params.taskId;
    const innerTaskId = req.body.innerTaskId;
    const taskNameToUpdate = req.body.newTaskName;

    if (!innerTaskId) {
        Task.findOne({ _id: taskId }, (err, doc) => {
            if (!err) {
                doc.taskName = taskNameToUpdate;
                console.log(doc)
                doc.save((err, doc) => {
                    if (!err) {
                        console.log(doc)
                        res.send("Task Inserted");

                    }
                    else
                        console.log('Error during record insertion : ' + err);
                });

            } else {
                res.send("task id not found")
            }
        })
    } else {
        Task.findOne({ _id: taskId }, (err, doc) => {
            if (!err) {
                var newTask = Task();

                doc.timer = doc.timer.filter((timer) => {
                    console.log(timer._id, innerTaskId)
                    if (timer.id !== innerTaskId) return true
                    else {
                        newTask.taskName = taskNameToUpdate;
                        newTask.projectName = doc.projectName;
                        newTask.startTime = timer.startTime;
                        newTask.endTime = timer.endTime;
                        newTask.duration = timer.duration;
                        newTask.timer = [{
                            startTime: timer.startTime,
                            endTime: timer.endTime,
                            duration: timer.duration
                        }]
                        return false
                    }
                })

                console.log(doc, newTask)
                doc.save((err, doc) => {
                    if (!err) {
                        // res.send("task name updated")
                    } else console.log('error updateing')
                })
                newTask.save((err, doc) => {
                    if (!err) {
                        console.log(doc)
                        res.send("Task Inserted");

                    }
                    else
                        console.log('Error during record insertion : ' + err);
                });

            } else {
                res.send("task id not found")
            }

        })
    }
}




//Creating function to update project name of existing
function updateProjectName(req, res) {
    const taskId = req.params.taskId;
    const innerTaskId = req.body.innerTaskId;
    const projectNameToUpdate = req.body.newProjectName;

    if (!innerTaskId) {
        Task.findOne({ _id: taskId }, (err, doc) => {
            if (!err) {
                doc.projectName = projectNameToUpdate;
                doc.save((err, doc) => {
                    if (!err) {
                        console.log(doc)
                        res.send("Task Inserted");

                    }
                    else
                        console.log('Error during record insertion : ' + err);
                });

            } else {
                res.send("task id not found")
            }
        })
    } else {
        Task.findOne({ _id: taskId }, (err, doc) => {
            if (!err) {
                var newTask = Task();
                if (doc.timer.length > 1) {
                doc.timer = doc.timer.filter((timer) => {
                    console.log(timer._id, innerTaskId)
                    if (timer.id !== innerTaskId) return true
                    else {
                        newTask.taskName = doc.taskName;
                        newTask.projectName = projectNameToUpdate;
                        newTask.startTime = timer.startTime;
                        newTask.endTime = timer.endTime;
                        newTask.duration = timer.duration;
                        newTask.timer = [{
                            startTime: timer.startTime,
                            endTime: timer.endTime,
                            duration: timer.duration
                        }]

                        doc.duration -= dateUtils.substractTimes(doc.duration, timer.duration)
                        return false
                    }
                })
            } else {
                doc.projectName = newProjectName
            }

                doc.startTime = doc.timer[0].startTime
                doc.endTime = doc.timer[doc.timer.length].endTime



                console.log(doc, newTask)
                doc.save((err, doc) => {
                    if (!err) {
                        // res.send("task name updated")
                    } else console.log('error updateing')
                })
                if (newTask.taskName) {
                    newTask.save((err, doc) => {
                        if (!err) {
                            console.log(doc)
                            res.send("Task Inserted");

                        }
                        else
                            console.log('Error during record insertion : ' + err);
                    });
                } else {
                    res.send("Task Inserted");

                }

            } else {
                res.send("task id not found")
            }

        })
    }
}





//Creating function to get all data from mongodb
function getAll(req, res) {
    Task.find((err, docs) => {
        res.send(docs)
    })
}

//Creating function to delete all data from mongodb
function deleteAll(req, res) {
    Task.deleteMany((err, docs) => {
        res.send(docs)
    })
}


module.exports.insertInDB = insertIntoMongoDB
module.exports.getAllTask = getAll
module.exports.deleteAllTask = deleteAll
module.exports.updateTaskName = updateTaskName
module.exports.updateProjectName = updateProjectName