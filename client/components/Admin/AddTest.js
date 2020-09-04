import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  ValidatorForm,
  TextValidator as TextField,
} from "react-material-ui-form-validator";

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
    padding: "2rem",
    textAlign: "center",
    margin: "2rem",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  titleForm: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  main: {
    marginTop: "1rem",
    width: "100%",
    justifyContent: "center",
  },
  demo: {
    margin: "3rem",
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: "3rem",
  },
  fab: {
    margin: theme.spacing(2),
  },
}));

function AddTest(props) {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState(null);
  const [selecctedTestTitle, setselecctedTestTitle] = React.useState(null);

  const emptyTitle = {
    title: "",
  };
  const [testData, setTestData] = useState(emptyTitle);
  const emptyQuestionData = {
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    point1: "",
    point2: "",
    point3: "",
    point4: "",
  };
  const [questionData, setQuestionData] = useState(emptyQuestionData);

  const [allTests, setAllTests] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [SelectedDeleteTest, setSelectedDeleteTest] = useState("null");
  const [SelectedDeleteQuestion, setSelectedDeleteQuestion] = useState("null");

  const handleClickOpen = (props) => {
    setSelectedDeleteTest(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen2 = (props) => {
    setSelectedDeleteQuestion(props);
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const deleteTest = () => {
    var id = SelectedDeleteTest.id;
    Axios.delete("/api/v1/user/test", { data: { id } }).then((res) => {
      if (res.data.success) {
        getAllTest();
        handleClose();
        setSelectedTest(null);
      }
    });
  };

  const deleteQuestion = () => {
    var id = SelectedDeleteQuestion.id;
    var filter = selectedTest.filter((el) => {
      return el._id != id;
    });
    console.log(id, filter);
    Axios.delete("/api/v1/user/test/question", { data: { id } }).then((res) => {
      console.log(res);
      if (res.data.success) {
        getAllTest();
        handleClose2();
        setSelectedTest(filter);
      }
    });
  };

  const handleChangeTest = (e) => {
    const { name, value } = e.target;
    setTestData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitTest = () => {
    setAllTests(null);
    Axios.post("/api/v1/user/test", testData).then((res) => {
      if (res.data.success) {
        getAllTest();
        setTestData(emptyTitle);
      }
    });
  };

  const handleSubmitQuestion = () => {
    var x = questionData;
    const addQuestion = {
      question: x.question,
      points: [x.point1, x.point2, x.point3, x.point4],
      options: [x.option1, x.option2, x.option3, x.option4],
      title: selecctedTestTitle.id,
    };

    Axios.post("/api/v1/user/test/question", addQuestion).then((res) => {
      if (res.data.success) {
        selectedTest.push(res.data.createdQuestion);
        getAllTest();
        setQuestionData(emptyQuestionData);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getAllTest = () => {
    Axios.get("/api/v1/user/tests").then((res) => {
      setAllTests(res.data.allTests);
    });
  };

  useEffect(() => {
    allTests ? "" : getAllTest();
  });
  console.log(allTests);
  return (
    <Grid container spacing={3} component="main" className={classes.main}>
      {/* Add Test Title here */}
      <Grid item xs={12} sm={8} md={selectedTest ? 5 : 12}>
        <Typography variant="h6" className={classes.title}>
          {allTests ? (
            allTests.length == 0 ? (
              "No Test are there"
            ) : (
              "List of Test"
            )
          ) : (
            <CircularProgress />
          )}
        </Typography>

        {allTests
          ? allTests.map((el) => {
              return (
                <div className={classes.demo}>
                  <List dense={dense}>
                    <ListItem>
                      <ListItemText
                        primary={el.title}
                        secondary={"No. of Question:" + el.questions.length}
                      />
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleClickOpen({ title: el.title, id: el._id })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Add"
                        aria-label="add"
                        onClick={() => {
                          setSelectedTest(el.questions);
                          setselecctedTestTitle({
                            id: el._id,
                            title: el.title,
                          });
                        }}
                      >
                        <Fab color="primary" className={classes.fab}>
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </ListItem>
                  </List>
                </div>
              );
            })
          : ""}

        <Paper className={classes.paper}>
          <ValidatorForm
            className={selectedTest ? classes.form : classes.titleForm}
            onSubmit={() => handleSubmitTest()}
            onError={(errors) => console.log(errors)}
          >
            <Grid item xs={12} md={selectedTest ? 12 : 6}>
              <Typography component="h1" variant="h5">
                Add Test
              </Typography>
              <br />
              <Grid item xs={12}>
                <TextField
                  autoComplete="title"
                  name="title"
                  variant="outlined"
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                  onChange={handleChangeTest}
                  value={testData.title}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add
              </Button>
            </Grid>
          </ValidatorForm>
        </Paper>
      </Grid>
      {/* Add Title Content here */}
      {selectedTest ? (
        <Grid item xs={12} sm={8} md={5} className={classes.main}>
          <Typography variant="h6" className={classes.title}>
            {"List of Questions in " + selecctedTestTitle.title}
          </Typography>
          {selectedTest
            ? selectedTest.map((el) => {
                return (
                  <div className={classes.demo}>
                    <List dense={dense}>
                      <ListItem>
                        <ListItemText primary={el.question} />
                        <Tooltip
                          title="Delete"
                          onClick={() =>
                            handleClickOpen2({ title: el.question, id: el._id })
                          }
                        >
                          <IconButton aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      {el.options.map((option, i) => {
                        return (
                          <ListItem>
                            <ListItemText
                              secondary={option + ": " + el.points[i]}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </div>
                );
              })
            : ""}
          {selecctedTestTitle ? (
            <Accordion className={classes.paper}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography component="h1" variant="h5">
                  {"Add Question for " + selecctedTestTitle.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ValidatorForm
                  className={classes.form}
                  onSubmit={() => handleSubmitQuestion()}
                  onError={(errors) => console.log(errors)}
                >
                  {/* <form className={classes.form} noValidate> */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="question"
                        name="question"
                        variant="outlined"
                        fullWidth
                        id="question"
                        label="Question"
                        autoFocus
                        onChange={handleChange}
                        value={questionData.question}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="option1"
                        label="Option 1"
                        name="option1"
                        autoComplete="option1"
                        onChange={handleChange}
                        value={questionData.option1}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="point1"
                        label="Point 1"
                        name="point1"
                        autoComplete="point1"
                        onChange={handleChange}
                        value={questionData.point1}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="option2"
                        label="Option 2"
                        name="option2"
                        autoComplete="option2"
                        onChange={handleChange}
                        value={questionData.option2}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="point2"
                        label="Point 2"
                        name="point2"
                        autoComplete="point2"
                        onChange={handleChange}
                        value={questionData.point2}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        name="option3"
                        label="Option 3"
                        type="option3"
                        id="option3"
                        autoComplete="option3"
                        onChange={handleChange}
                        value={questionData.option3}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="point3"
                        label="Point 3"
                        name="point3"
                        autoComplete="point3"
                        onChange={handleChange}
                        value={questionData.point3}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        autoComplete="option4"
                        name="option4"
                        variant="outlined"
                        fullWidth
                        id="option4"
                        label="Option 4"
                        autoFocus
                        onChange={handleChange}
                        value={questionData.option4}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="point4"
                        label="Point 4"
                        name="point4"
                        autoComplete="point4"
                        onChange={handleChange}
                        value={questionData.point4}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Add Question
                  </Button>
                </ValidatorForm>
              </AccordionDetails>
            </Accordion>
          ) : (
            ""
          )}
        </Grid>
      ) : (
        ""
      )}

      {/* Dialog Box*/}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete " + SelectedDeleteTest.title + "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your Data will be lost if you click on Yes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={deleteTest} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Box 2*/}
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete this Question?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {SelectedDeleteQuestion.title}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2} color="primary">
            No
          </Button>
          <Button onClick={deleteQuestion} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(AddTest);
