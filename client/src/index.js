import React from "react";
import ReactDOM from "react-dom";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./index.css";
// import App from "./App";
import injectTapEventPlugin from "react-tap-event-plugin";
import registerServiceWorker from "./registerServiceWorker";
import { browserHistory, Router } from "react-router";
import routes from "./routes.js";

// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

// ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider>,
  document.getElementById("root")
);
registerServiceWorker();
