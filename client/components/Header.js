import { connect } from "react-redux";
import { Link } from "@material-ui/core";
import { Link as Rlink } from "react-router-dom";
import "../scss/index.scss";
import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Button from "@material-ui/core/Button";
import { logoutUser } from "../store/actions";
import svg from "./hero.svg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  buttons: {
    marginLeft: "auto",
  },
  button2: {
    textAlign: "center",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  img: {
    margin: ".5rem",
    height: "3rem",
  },
}));

function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const logoutUser = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {props.isAuthDone ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <></>
          )}

          {open ? (
            ""
          ) : (
            <Typography variant="h6" noWrap>
              SWOT
            </Typography>
          )}
          {!props.isAuthDone ? (
            <div className={classes.buttons}>
              <Link href="/login">
                <Button variant="contained" color="primary">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="contained">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <div className={classes.buttons + ` side ${open ? "none" : ""}`}>
              <Button variant="contained" color="primary">
                {props.currentUser
                  ? props.currentUser.firstName[0] +
                    props.currentUser.lastName[0]
                  : "..."}
              </Button>
              <Button variant="contained" onClick={() => logoutUser()}>
                LogOut
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {props.isAuthDone ? (
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.button2 + ` side ${!open ? "none " : ""}`}>
            <img className={classes.img} src={svg} />
            <br />
            <Typography variant="h6" noWrap>
              SWOT
            </Typography>
            <br />
            <Button variant="contained" color="primary">
              {props.currentUser
                ? props.currentUser.firstName +
                  " " +
                  props.currentUser.lastName[0] +
                  "."
                : "..."}
            </Button>
            <Button variant="contained" onClick={() => logoutUser()}>
              LogOut
            </Button>
          </div>
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>

          <Divider />
          <List>
            <Rlink to="/" style={{ textDecoration: "none", color: "black" }}>
              <ListItem button key={"Home"}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
            </Rlink>
          </List>
          <Divider />
          <List>
            <Rlink
              to={"/" + props.currentUser.userType}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key={"DashBoard"}>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={"DashBoard"} />
              </ListItem>
            </Rlink>
          </List>
          <List>
            <Rlink
              to={"/" + props.currentUser.userType + "/test"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key={"Test"}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Test"} />
              </ListItem>
            </Rlink>
          </List>
          <List>
            <Rlink
              to={"/adduser"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key={"Add User"}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={"Add User"} />
              </ListItem>
            </Rlink>
          </List>
        </Drawer>
      ) : (
        ""
      )}
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(Header);
