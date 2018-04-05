import React, { Fragment } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import AsyncRoute from "./core/utils/AsyncRoute";

export default () => (
  <Switch>
    <Redirect exact from="/" to="/home" />
    <AsyncRoute path="/home" loader={() => import(/* webpackChunkName: "page-home" */ "./home/HomePage")} />
    <AsyncRoute path="/user" loader={() => import(/* webpackChunkName: "page-user" */ "./user/UserPage")} />
    <AsyncRoute path="/service" loader={() => import(/* webpackChunkName: "page-service" */ "./service/ServicePage")} />
  </Switch>
);
