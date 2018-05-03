"use strict";

// middleware
import { isAuthenticated, isUnauthenticated } from "./middleware/auth";
import { setRedirect, setRender } from "middleware-responder";

const secrets = require("./config/secrets");
// controllers
var users = require("./controllers/users-controller");

const { getProfile } = require("./controllers/profile-controller");
const { getHome } = require("./controllers/main-controller");
const passwords = require("./controllers/passwords-controller");
const registrations = require("./controllers/registrations-controller");
const sessions = require("./controllers/sessions-controller");

module.exports = function(app) {
  // homepage and dashboard
  app.get(
    "/",
    setRedirect({
      auth: "/dashboard"
    }),
    isUnauthenticated(),
    setRender("index"),
    getHome
  );

  // sessions
  app.post(
    "/login",
    setRedirect({
      auth: "/dashboard",
      success: "/dashboard",
      failure: "/login"
    }),
    isUnauthenticated(),
    sessions.postLogin
  );
  app.get(
    "/logout",
    setRedirect({
      auth: "/",
      success: "/"
    }),
    isAuthenticated(),
    sessions.logout
  );

  // registrations
  app.get(
    "/signup",
    setRedirect({
      auth: "/dashboard"
    }),
    isUnauthenticated(),
    setRender("signup"),
    registrations.getSignup
  );
  app.post(
    "/signup",
    setRedirect({
      auth: "/dashboard",
      success: "/dashboard",
      failure: "/signup"
    }),
    isUnauthenticated(),
    registrations.postSignup
  );

  // forgot password
  app.get(
    "/forgot",
    setRedirect({
      auth: "/dashboard"
    }),
    isUnauthenticated(),
    setRender("forgot"),
    passwords.getForgotPassword
  );
  app.post(
    "/forgot",
    setRedirect({
      auth: "/dashboard",
      success: "/forgot",
      failure: "/forgot"
    }),
    isUnauthenticated(),
    passwords.postForgotPassword
  );

  // reset tokens
  app.get(
    "/reset/:token",
    setRedirect({
      auth: "/dashboard",
      failure: "/forgot"
    }),
    isUnauthenticated(),
    setRender("reset"),
    passwords.getToken
  );
  app.post(
    "/reset/:token",
    setRedirect({
      auth: "/dashboard",
      success: "/dashboard",
      failure: "back"
    }),
    isUnauthenticated(),
    passwords.postToken
  );

  // user api stuff

  app.get(
    "/profile",
    setRender("dashboard/profile"),
    setRedirect({
      auth: "/"
    }),
    isAuthenticated(),
    getProfile
  );
  app.post(
    "/user/password",
    setRedirect({
      auth: "/",
      success: "/profile",
      failure: "/profile"
    }),
    isAuthenticated(),
    passwords.postNewPassword
  );
  app.post(
    "/user/delete",
    setRedirect({
      auth: "/",
      success: "/"
    }),
    isAuthenticated(),
    users.deleteAccount
  );
};
