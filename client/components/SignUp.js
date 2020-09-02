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

import {
  ValidatorForm,
  TextValidator as TextField,
} from "react-material-ui-form-validator";
import { userSignUp, userAuthProgress } from "../store/actions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://piyushsi.me">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    props
      .dispatch(userSignUp(data))
      .then((res) => {
        console.log(res);
        if (res.success) return props.history.push("/");
        if (res.message.includes("already"))
          return setData((prevState) => ({
            ...prevState,
            msg: "User with same email already exists",
          }));
      })
      .catch((err) => {
        console.log(err, "signup failed", data.msg);
        props.dispatch(
          userAuthProgress({ isAuthInProgress: false, isAuthDone: false })
        );
      });
  };

  console.log(props);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <br />
        <ValidatorForm
          className={classes.form}
          onSubmit={() => handleSubmit()}
          onError={(errors) => console.log(errors)}
        >
          {/* <form className={classes.form} noValidate> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleChange}
                value={data.firstName}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange}
                value={data.lastName}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>

            <Grid item xs={12}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={data.password}
                validators={[
                  "required",
                  "matchRegexp:^[A-Z | a-z | 0-9 | !,@,#,$,$,^,&,*,(,),_,+]{6,15}$",
                ]}
                errorMessages={["passwword is required", "minimum length is 6"]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="UserType"
                name="userType"
                variant="outlined"
                fullWidth
                id="userType"
                label="User Type"
                autoFocus
                onChange={handleChange}
                value={data.userType}
                validators={["required", "matchRegexp:user|admin|subadmin"]}
                errorMessages={[
                  "this field is required",
                  "user or admin or subadmin",
                ]}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
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
            {props.isAuthInProgress ? (
              <CircularProgress style={{ color: "white" }} />
            ) : (
              "Sign Up"
            )}
          </Button>
        </ValidatorForm>
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
        {/* </form> */}
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(SignUp);
