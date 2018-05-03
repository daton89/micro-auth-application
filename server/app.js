"use strict";

var express = require("express");
var secrets = require("./config/secrets");
var path = require("path");
var mongoose = require("mongoose");
var errorHandler = require("./middleware/error");
const config = require("./config/environment");
const http = require("http");
const bugsnag = require("bugsnag");

// setup db
mongoose.connect(secrets.db);
mongoose.connection.on("error", function() {
  console.error("MongoDB Connection Error. Make sure MongoDB is running.");
});

// express setup
var app = express();

var server = http.createServer(app);

if (app.get("env") !== "production") {
  app.use("/styles", express.static(__dirname + "/../.tmp/styles"));
  // app.use('/', routes.styleguide);
}

require("./config/express")(app);

// setup routes
require("./routes")(app);

app.use(bugsnag.errorHandler);

/// catch 404 and forwarding to error handler
app.use(errorHandler.notFound);

/// error handlers
if (app.get("env") === "development") {
  app.use(errorHandler.development);
} else {
  app.use(errorHandler.production);
}

function onListen() {
  console.log("Express server listening on port " + server.address().port);
}

server.listen(app.get("port"), config.ip, onListen);

app.shutdown = function shutdonw() {
  server.close();
};

module.exports = app;
