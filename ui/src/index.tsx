import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const container = document.createElement("div");
document.body.insertBefore(container, document.body.firstChild);
ReactDOM.render(<App />, container);
