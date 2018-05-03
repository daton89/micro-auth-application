#!/usr/bin/env node

require("dotenv").config();

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const engineStrict = require("engine-strict");
const config = require("./config/environment");

const debug = require("debug")("app");

if (config.root !== process.cwd()) {
  process.chdir(config.root);
}

engineStrict.check();

process.on("uncaughtException", function(err) {
  console.error("Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

require("./app");
