import { connect } from "react-redux";
import React, { useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from '@material-ui/core/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tree from "react-d3-tree";
import "regenerator-runtime";
import {
  ValidatorForm,
  TextValidator as TextField,
} from "react-material-ui-form-validator";
import Axios from "axios";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(13),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp(props) {
  const classes = useStyles();

  const [data, setData] = useState({
    email: "",
    userType: "",
    id: props.currentUser._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [render, setRender] = useState(null);

  const handleSubmit = () => {
    Axios.post("/api/v1/user/user/add", data).then((res) => {
      setRender(true);
    });
  };

  const tree = (arr) => {
    return arr.length == 0
      ? ""
      : arr.map((el) => {
          return {
            name: el.email,
            attributes: {
              userType: el.userType,
              org: el.organisationId ? el.organisationId : "Not Registered",
            },
            children: el.clients[0] ? tree(el.clients) : "",
          };
        });
  };
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    treeData ? "" : setTreeData(tree(props.currentUser.clients));
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <div
          id="treeWrapper"
          style={{ width: "80vw", height: "70vh", border: "1px solid black" }}
        >
          <Tree
            data={[
              {
                name: props.currentUser.firstName,
                attributes: {
                  userType: props.currentUser.userType,
                  org: props.currentUser.organisationId,
                },
                children: treeData ? treeData : "",
              },
            ]}
          />
        </div>
        <Typography component="h1" variant="h5">
          Add User
        </Typography>
        <br />
        <ValidatorForm
          className={classes.form}
          onSubmit={() => handleSubmit()}
          onError={(errors) => console.log(errors)}
        >
          {/* <form className={classes.form} noValidate> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={data.email}
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                fullWidth
                id="userType"
                label="User Type"
                name="userType"
                autoComplete="lname"
                onChange={handleChange}
                value={data.userType}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>
          </Grid>
          <Typography style={{ color: "red" }}>
            {data.msg ? data.msg : ""}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add
          </Button>
        </ValidatorForm>
        <Grid container justify="flex-end"></Grid>
        {/* </form> */}
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(SignUp);
