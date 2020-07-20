const mongoose = require('mongoose');

//Attributes of the Course object
var taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: 'This field is required!'
    },
    projectName: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    timer: [{
        startTime: {
            type: String
        },
        endTime: {
            type: String
        },
        duration: {
            type: String
        }
    }],
    duration: {
        type: String
    }
});

mongoose.model('task', taskSchema);