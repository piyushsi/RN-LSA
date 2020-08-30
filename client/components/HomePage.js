import { connect } from "react-redux";

import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import svg from "./hero.svg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  head: {
    height: "85vh",
    backgroundColor: "#3f51b5",
    textAlign: "center",
  },
  head_1: {
    color: "white",
  },
  head_0: {
    paddingTop: "5rem",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  img: {
    width: "40vw",
    height:"50vh"
  },
}));

function HomePage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  console.log(props);
  return (
    <div className={classes.root}>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.head}>
          <div className={classes.head_0}>
            <img className={classes.img} src={svg} />
            <Typography
              variant="h3"
              className={classes.head_1}
              component="h2"
              gutterBottom
            >
              SWOT Careers is an online career guidance platform.
            </Typography>
            <Typography
              variant="h5"
              className={classes.head_1}
              component="h2"
              gutterBottom
            >
              We conduct psychometric tests on students (aged 13 to 30) and
              suggest them the most suitable career path to pursue.
            </Typography>
          </div>
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(HomePage);
