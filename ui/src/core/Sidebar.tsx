import React, { CSSProperties } from "react";
import { Route, RouteComponentProps } from "react-router-dom";

// import { compose } from "recompose";

import Divider from "material-ui/Divider";
import Drawer from "material-ui/Drawer";
import List, { ListItem, ListItemIcon, ListItemProps, ListItemText } from "material-ui/List";
import { MenuItem, MenuList } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";

import UserIcon from "material-ui-icons/AccountBox";
import ServiceIcon from "material-ui-icons/Apps";
import HomeIcon from "material-ui-icons/Home";

const drawerWidth = 250;

const decorate = withStyles(({ palette, spacing, mixins }) => ({
  toolbar: mixins.toolbar,

  drawerPaper: {
    width: drawerWidth,
    position: "absolute",
  } as CSSProperties, // hack position absolute

  activeMenu: {
    backgroundColor: palette.primary.light,

    "&:hover": {
      backgroundColor: palette.primary.dark,
    },

    "& $menuText, & $icon": {
      color: palette.common.white,
    },
  },

  menuText: {},
  icon: {},
}));

interface IProps {
  open: boolean;
}
interface IMenuLinkProps extends ListItemProps {
  to: string;
  activeClassName: string;
  children: React.ReactNode;
}

const MenuLink = ({ to, children }: IMenuLinkProps) => (
  <Route
    path={to}
    children={({ match, history }: RouteComponentProps<{}>) => (
      <MenuItem onClick={() => !match && history.push(to)} selected={!!match}>
        {children}
      </MenuItem>
    )}
  />
);

const SideBar = decorate<IProps>(({ classes, open }) => (
  <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
    <div className={classes.toolbar} />
    <MenuList>
      <MenuLink to="/home" activeClassName={classes.activeMenu}>
        <ListItemIcon className={classes.icon}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.menuText }} primary="Home" />
      </MenuLink>
      <MenuLink to="/service" activeClassName={classes.activeMenu}>
        <ListItemIcon className={classes.icon}>
          <ServiceIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.menuText }} primary="Apps" />
      </MenuLink>
      <MenuLink to="/user" activeClassName={classes.activeMenu}>
        <ListItemIcon className={classes.icon}>
          <UserIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.menuText }} primary="User" />
      </MenuLink>
    </MenuList>
    <Divider />
    <List component="nav">
      <ListItem button>
        <ListItemText primary="Trash" />
      </ListItem>
      <ListItem button component="a" href="#simple-list">
        <ListItemText primary="Spam" />
      </ListItem>
    </List>
  </Drawer>
));

export default SideBar;
