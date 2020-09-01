import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Test from "./Test";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "3rem",
    textAlign:'center'
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



export default function HorizontalNonLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [completedSet, setCompletedSet] = React.useState(false);
  const [next, setNext] = React.useState(false);


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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setNext(true)
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  const done = () => {
    setCompletedSet(true);
  };

//Steps
  function getSteps() {
    return [
      "Interest Test",
      "Personality Test",
      "Abilities Test",
      "Career Inspirational Test",
    ];
  }


  function getStepContent(step, done) {
    return completedSet?'':<Test data={done} />
    // switch (step) {
    //   case 0:
    //     return completed?'':<Test data={done} />;
    //   case 1:
    //     return <Test data={done} />;
    //   case 2:
    //     return <Test data={done} />;
    //   case 3:
    //     return <Test data={done} />;
    //   default:
    //     return "Unknown step";
    // }
  }
  // console.log(activeStep,completed,completedSet)

  return (
    <div className={classes.root}>
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
            {/* <Button onClick={handleReset}>Reset</Button> */}
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep, done)}
            </Typography>
            <div>
              {/* <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button> */}
              {next? <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>:''}
             
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" className={classes.completed}>
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
    </div>
  );
}
