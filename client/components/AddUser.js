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
import {
  ValidatorForm,
  TextValidator as TextField,
} from "react-material-ui-form-validator";
import Axios from "axios";
import { useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import { identifyLoggedUser } from "../store/actions";
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
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  text: {
    textAlign: "center",
  },
}));

function SignUp(props) {
  const classes = useStyles();

  const handleChange = (e) => {
    setMessage(null);
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [canAdd, setCanAdd] = useState(true);

  const handleChangeLevel = (e) => {
    setMessage(null);
    const { name, value } = e.target;
    props.currentUser.userType == `L${value[1] - 1}`
      ? setCanAdd(true)
      : setCanAdd(false);
    props.currentUser.userType == `L${value[1] - 1}`
      ? setData((prevState) => ({
          ...prevState,
          [name]: value,
          id: props.currentUser._id,
        }))
      : setData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
  };

  const [render, setRender] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = () => {
    setMessage(null);
    Axios.post("/api/v1/user/user/add", data).then((res) => {
      if (res.data.success) {
        setMessage("Added");
        props.dispatch(identifyLoggedUser());
      } else {
        res.data.message.includes("already")
          ? setMessage("Email is already added")
          : setMessage("Unkown Error");
      }
    });
  };

  const [lastLevel, setLastLevel] = useState(
    `L${+props.currentUser.userType[1] + 1}`
  );

  const level = (val) => {
    var arr = ["L1", "L2", "L3", "L4"];
    var res = [];
    var store = false;
    arr.forEach((a) => {
      if (a == props.currentUser.userType) {
        store = true;
      } else {
        store ? res.push(a) : "";
      }
    });

    return res;
  };

  const [data, setData] = useState({
    email: "",
    userRole: "",
    userType: level()[0],
    id: props.currentUser._id,
  });

  const levelWiseUsers = (x) => {
    var res = [];
    function rec(arr) {
      arr.forEach((a) => {
        a.userType == x ? res.push(a) : rec(a.clients);
      });
    }
    rec(props.currentUser.clients);
    return res;
  };

  const tree = (arr) => {
    arr && arr.length != 0 ? setLastLevel(`L${+arr[0].userType[1] + 1}`) : "";
    return !arr || arr.length == 0
      ? ""
      : arr.map((el) => {
          return {
            name: el.firstName ? el.firstName : el.email,
            attributes: {
              userType: el.userType,
              Reg: el.organisationId ? el.organisationId : "Not Registered",
              Role: el.userRole,
            },
            children: !el.clients || el.clients[0] ? tree(el.clients) : "",
          };
        });
  };

  const [treeData, setTreeData] = useState(null);
  useEffect(() => {
    treeData ? "" : setTreeData(tree(props.currentUser.clients));
  });

  var levelData =
    data.userType != level()[0]
      ? levelWiseUsers(`L${data.userType[1] - 1}`)
      : null;

  console.log(data);

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
            translate={{ x: 20, y: 280 }}
            nodeSvgShape={{ shape: "circle", shapeProps: { r: 10 } }}
            data={[
              {
                name: props.currentUser.firstName,
                attributes: {
                  userType: props.currentUser.userType,
                  Reg: props.currentUser.organisationId,
                  Role: props.currentUser.userRole,
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
        {!canAdd ? (
          <div style={{ color: "red" }} className={classes.text}>
            Select a Parent User to add
          </div>
        ) : (
          ""
        )}
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

            <Grid item xs={12} sm={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">
                  userType
                </InputLabel>
                <Select
                  native
                  name="userType"
                  value={data.userType}
                  label="userType"
                  onChange={handleChangeLevel}
                >
                  {level().map((el) => {
                    return el <= lastLevel ? (
                      <option value={el}>{el}</option>
                    ) : (
                      ""
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="userRole"
                label="User Role"
                name="userRole"
                autoComplete="userRole"
                onChange={handleChange}
                value={data.userRole}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
            </Grid>
            {levelData ? (
              <Grid item xs={12}>
                {levelData.map((el) => {
                  return (
                    <Chip
                      clickable
                      variant="outlined"
                      color="primary"
                      avatar={<Avatar>{el.userType}</Avatar>}
                      label={el.email}
                      onClick={() => {
                        handleChange({ target: { name: "id", value: el._id } });
                        setCanAdd(true);
                      }}
                    />
                  );
                })}
                <br />
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Typography style={{ color: "red" }}>
            {data.msg ? data.msg : ""}
          </Typography>
          {canAdd ? (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add
            </Button>
          ) : (
            ""
          )}
        </ValidatorForm>
        {message ? <Typography>{message}</Typography> : ""}
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
