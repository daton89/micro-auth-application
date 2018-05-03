const config = require("./environment");
const moment = require("moment");
const bugsnag = require("bugsnag");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const express = require("express");
const path = require("path");
var expressValidator = require("express-validator");
var flash = require("express-flash");
var cors = require("cors");
var viewHelper = require("../middleware/view-helper");
var lodash = require("lodash");
var passport = require("passport");
var session = require("express-session");
const RedisStore = require("connect-redis")(session);
var swig = require("swig");
var secrets = require("./secrets");

logger.token("user", function user(req) {
  if (req.user) return req.user.username;
});
logger.token("time", function time() {
  return moment().format("YY/MM/DD-HH:mm:sss");
});

module.exports = function(app) {
  app.set("env", process.env.NODE_ENV);
  app.set("port", config.port);

  app.locals.ENV = app.get("env");
  app.locals.ENV_DEVELOPMENT = app.get("env") == "development";
  app.locals.production = app.get("env") === "production";

  bugsnag.register(config.bugsnag.token);

  if (app.get("env") === "production") {
    swig.setDefaults({ cache: "memory" });
  } else {
    swig.setDefaults({ cache: false });
  }

  // This is where all the magic happens!
  app.engine("html", swig.renderFile);
  app.set("views", path.join(config.root, "server", "views"));
  app.set("view engine", "html");
  app.locals._ = lodash;

  // setup view helper
  app.use(viewHelper);

  if (app.get("env") === "production" || app.get("env") === "stage") {
    app.enable("trust proxy");
  }

  app.use(
    bodyParser.json({
      strict: true,
      inflate: true,
      limit: "5mb"
    })
  );

  app.use(
    bodyParser.urlencoded({
      extended: false,
      inflate: true,
      limit: "5mb",
      parameterLimit: 1000
    })
  );

  app.use(expressValidator());

  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());

  config.sessionStore.host = secrets.sessionStoreHost;
  app.use(
    session({
      name: secrets.sessionName,
      secret: secrets.sessionSecret,
      cookie: config.session.cookie,
      resave: config.session.resave,
      rolling: config.session.rolling,
      saveUninitialized: config.session.saveUninitialized,
      store: new RedisStore(config.sessionStore)
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  require("./passport")(passport);

  // other
  app.use(flash());
  app.use(cors({ origin: "*" }));

  app.use(favicon(path.join(config.root, "public/favicon.ico")));

  app.use(express.static(path.join(config.root, "public")));

  app.use(
    logger(
      ":time :user :remote-addr :method :status :url :res[content-length] :response-time ms"
    )
  );
};
