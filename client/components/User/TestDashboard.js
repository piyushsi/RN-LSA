import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Test from "./Test";
import { connect } from "react-redux";
import Axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "3rem",
    textAlign: "center",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: "inline-block",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function TestDashBoard(props) {
  console.log(props);

  // Fetch Data
  const getAllTest = () => {
    Axios.get("/api/v1/user/tests").then((res) => {
      res.data.allTests.length == 0
        ? setAllTests([{ questions: [], title: "test" }])
        : setAllTests(res.data.allTests);
    });
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const data = () => {
    const bufferQuestion = [
      {
        question: "test_case",
        points: [0, 0, 0, 0],
        options: ["test", "test", "test", "test"],
      },
    ];
    if (allTests) {
      const Title = allTests[activeStep].title;
      const Data =
        allTests[activeStep].questions.length == 0
          ? bufferQuestion
          : allTests[activeStep].questions;
      const Steps = allTests.map((el) => {
        return el.title;
      });
      return { Title, Data, Steps };
    }
  };

  const classes = useStyles();
  const [allTests, setAllTests] = useState(null);

  const [completed, setCompleted] = React.useState({});
  const [completedSet, setCompletedSet] = React.useState(false);
  const [next, setNext] = React.useState(false);

  //Steps
  function getSteps() {
    return allTests ? data().Steps : "";
  }

  const steps = getSteps();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    setCompletedSet(false);
    setNext(false);
  };

  // Current Step
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // next Button onClick
  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setNext(true);
  };

  // props for children Components
  const done = () => {
    setCompletedSet(true);
  };

  // passing Children Components for Each Steps
  function getStepContent(step, done) {
    return completedSet ? "" : <Test data={{ done, data: data() }} />;
  }
  useEffect(() => {
    allTests ? "" : getAllTest();
  });
  console.log(activeStep);

  return (
    <div className={classes.root}>
      {allTests ? (
        <>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton
                  // onClick={handleStep(index)}
                  completed={completed[index]}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep, done)}
                </Typography>
                <div>
                  {next ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Next
                    </Button>
                  ) : (
                    ""
                  )}

                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        variant="caption"
                        className={classes.completed}
                      >
                        Step {activeStep + 1} completed
                      </Typography>
                    ) : completedSet ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleComplete}
                        >
                          {completedSteps() === totalSteps() - 1
                            ? "Finish"
                            : "Complete Step"}
                        </Button>
                      </>
                    ) : (
                      ""
                    ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  return user;
};

export default connect(mapStateToProps)(TestDashBoard);
