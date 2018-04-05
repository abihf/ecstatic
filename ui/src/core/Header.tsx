import MenuIcon from "material-ui-icons/Menu";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import { withStyles } from "material-ui/styles";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import React from "react";

import { compose } from "recompose";

import gql from "graphql-tag";
import { ChildProps, graphql } from "react-apollo";

import { BasiUserInfoQuery } from "../generated";

const USER_QUERY = gql`
  query BasiUserInfo {
    viewer {
      me {
        full_name
      }
    }
  }
`;

const withGql = graphql<BasiUserInfoQuery, {}>(USER_QUERY);

const decorate = withStyles(({ palette, spacing }) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}));

const Header = decorate<ChildProps<{}, BasiUserInfoQuery>>(({ classes, data, ...props }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          {data && data.loading ? "Loading" : data && data.viewer && data.viewer.me.full_name}
        </Typography>
        <Button color="inherit">Login l</Button>
      </Toolbar>
    </AppBar>
  </div>
));

export default withGql(Header);
