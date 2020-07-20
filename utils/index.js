const moment = require('moment');

module.exports.formatDate = function(date) {return moment(date).format('DD MMMM YYYY');}
// const formatTime = date => {
//   date = new Date(date);
//   let hour = date.getHours();
//   let minutes = date.getMinutes();
//   let seconds = date.getSeconds();
//   const getCurrentAmPm = hour >= 12 ? 'PM' : 'AM';
//   hour %= 12;
//   hour = hour || 12;
//   minutes = minutes < 10 ? `0${minutes}` : minutes;
//   seconds = seconds < 10 ? `0${seconds}` : seconds;

//   return `${formatNumber(hour)}:${formatNumber(minutes)}:${formatNumber(
//     seconds,
//   )} ${getCurrentAmPm}`;
// };

 function msConversion(millis) {
  let sec = Math.round(millis / 1000);
  const hrs = Math.round(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.round(sec / 60);
  sec -= min * 60;

  sec = `${sec}`;
  sec = `00${sec}`.substring(sec.length);

  if (hrs > 0) {
    min = `${min}`;
    min = `00${min}`.substring(min.length);
    return `${formatNumber(hrs)}:${formatNumber(min)}:${formatNumber(sec)}`;
  }
  return `${formatNumber(hrs)}:${formatNumber(min)}:${formatNumber(sec)}`;
}

 function formatNumber(number) {
  return `0${number}`.slice(-2);
}

// export const translateLanguage = (intl, languageKey) =>
//   intl.formatMessage({
//     id: languageKey,
//   });

module.exports.timeDifference = function (start, end) { return msConversion(Math.abs(new Date(start) - new Date(end)));}

// /* eslint-disable */
module.exports.addTimes = function(timers) {
  const times = [0, 0, 0];
  const max = times.length;

  console.log('timers', timers)
  for (let j = 0; j < timers.length; j += 1) {
    const b = (timers[j] || '').split(':');

    // normalize time values
    for (let i = 0; i < max; i += 1) {
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
    }

    // store time values
    for (let i = 0; i < max; i += 1) {
      times[i] = times[i] + b[i];
    }
  }

  let hours = times[0];
  let minutes = times[1];
  let seconds = times[2];

  console.log(times)

  if (seconds >= 60) {
    const m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    const h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(
    -2,
  )}:${`0${seconds}`.slice(-2)}`;
};

module.exports.substractTimes = function (total, time) {
  const times = [0, 0, 0];
  const max = times.length;

  const a = (total || '').split(':');
  const b = (time || '').split(':');
  for (var i = 0; i < max; i += 1) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
  }

  // store time values
  for (var i = 0; i < max; i += 1) {
    times[i] = a[i] - b[i];
  }

  let hours = times[0];
  let minutes = times[1];
  let seconds = times[2];

  if (seconds >= 60) {
    const m = (seconds / 60) << 0;
    minutes += m;
    seconds -= 60 * m;
  }

  if (minutes >= 60) {
    const h = (minutes / 60) << 0;
    hours += h;
    minutes -= 60 * h;
  }

  return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(
    -2,
  )}:${`0${seconds}`.slice(-2)}`;
};


/**
 * Method to sort tasks, merge them and divide them on conditions
 * @param {*} tasks List of all tasks
 * @param {*} task task to insert in existing list
 */
module.exports.sortTask =  function (tasks, task) {
  let taskExist = false;

  // Map(loop) over all existing task
  tasks = tasks.map(internalTask => {
    // Check for taskName & projectName && its time in exisiting list
    if (
      task.taskName === internalTask.taskName &&
      task.projectName === internalTask.projectName &&
      formatDate(task.startTime) === formatDate(internalTask.startTime)
    ) {
      // Check if it has contained more then 1 sub-tasks
      if (task.timer && task.timer.length > 1) {
        // if it has sub-tasks, merge it to existing sub-tasks
        internalTask.timer = internalTask.timer.concat(task.timer);
        internalTask.duration = addTimes([
          internalTask.duration,
          task.duration,
        ]);
      } else {
        // if it has single sub-task or no sub-task, then concat single sub-task to existing
        internalTask.timer = internalTask.timer.concat({
          startTime: task.startTime,
          endTime: task.endTime,
          duration: timeDifference(task.startTime, task.endTime),
        });

        internalTask.duration = addTimes([
          internalTask.duration,
          timeDifference(task.startTime, task.endTime),
        ]);
      }
      internalTask.endTime = task.endTime;

      taskExist = true;
    }

    // Sort the sub-tasks according to its start-time
    internalTask.timer.sort(function(a, b) {
      return new Date(b.startTime) - new Date(a.startTime);
    });
    // internalTask.timer = _.sortBy(internalTask.timer, ['startTime']).reverse();
    internalTask.endTime = internalTask.timer[0].endTime;
    internalTask.startTime =
      internalTask.timer[internalTask.timer.length - 1].startTime;
    return internalTask;
  });

  // Condition if task is not present in existing list
  if (!taskExist) {
    if (task.timer === undefined || task.timer.length <= 1) {
      task = {
        ...task,
        taskName: task.taskName.trim(),
        id: uuid(),
        duration: timeDifference(task.startTime, task.endTime),
        timer: [
          {
            startTime: task.startTime,
            endTime: task.endTime,
            duration: timeDifference(task.startTime, task.endTime),
          },
        ],
      };
    }

    // Concat task to existing list
    tasks = tasks.concat(task);
  }
  tasks.sort(function(a, b) {
    return new Date(b.endTime) - new Date(a.endTime);
  });

  // tasks = _.sortBy(tasks, ['endTime']).reverse();

  return tasks;
}