import React, { Fragment } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import green from "material-ui/colors/green";
import orange from "material-ui/colors/orange";
import CssBaseline from "material-ui/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "material-ui/styles";

import Header from "./core/Header";
import Sidebar from "./core/Sidebar";
import Routes from "./Routes";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: orange[300],
      main: orange[500],
      dark: orange[700],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
});

const apolloClient = new ApolloClient({ uri: "/graphql" });

export default () => (
  <HashRouter>
    <ApolloProvider client={apolloClient}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Sidebar open={false} />
        <Routes />
      </MuiThemeProvider>
    </ApolloProvider>
  </HashRouter>
);
