'use strict';

const todosCreate = require('./lambda/todos-create.js');
const todosReadAll = require('./lambda/todos-read-all.js');
const todosReadOne = require('./lambda/todos-read-one.js');
const todosUpdate = require('./lambda/todos-update.js');
const todosDelete = require('./lambda/todos-delete.js');


/////////////////////////////////////////////////////
const boxstatusAll = require('./lambda/boxstatus-all.js');

module.exports.boxAll = (event, context, callback) => {
  boxstatusAll(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};
/////////////////////////////////////////////////////
const boxstatusUp = require('./lambda/boxstatus-up.js');

module.exports.boxUp = (event, context, callback) => {
  boxstatusUp(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};
/////////////////////////////////////////////////////
const todosLineRes = require('./lambda/todos-line-res.js');

module.exports.lineRes = (event, context, callback) => {
  todosLineRes(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};
/////////////////////////////////////////////////////


module.exports.create = (event, context, callback) => {
  todosCreate(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};

module.exports.readAll = (event, context, callback) => {
  todosReadAll(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};

module.exports.readOne = (event, context, callback) => {
  todosReadOne(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};

module.exports.update = (event, context, callback) => {
  todosUpdate(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};

module.exports.delete = (event, context, callback) => {
  todosDelete(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};
