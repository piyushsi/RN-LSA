import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./test.css";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Title = "Interest Test";
const Data = [
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    points: [4, 0, 0, 0],
  },
  {
    question: "What does PS stand for?",
    options: ["Play Station", "Piyush Sinha", "PSP", "PSPSP"],
    points: [0, 4, 0, 0],
  },
  {
    question: "IPS का पूर्ण रूप क्या है??",
    options: [
      "Indian Police Service",
      "In-Plane Switching",
      "Internet Protocol Service",
      "भारतीय पुलिस सेवा",
    ],
    points: [1, 2, 3, 4],
  },
];

export default function ListDividers(props) {
  const classes = useStyles();
  var [count, setCount] = React.useState(0);
  var [title, setTitle] = React.useState(Title);
  var [data, setData] = React.useState(Data);
  var [answer, setAnswer] = React.useState(null);
  var [answers, setAnswers] = React.useState([]);
  var [message, setMessage] = React.useState(null);
  var [completed, setCompleted] = React.useState(null);

  const answerPush = (a) => {
    var arr = answers;
    arr.push(a - 1);
    setAnswers(arr);
  };

  const submit = () => {
    if (answer && count == data.length - 1 ) {
      setCompleted(true);
      props.data();
      answerPush(answer);

      var points = answers
        .map((el, i) => {
          return data[i].points[el];
        })
        .join("+");

      alert("Total Points:"+eval(points));

    } else {
      if (answer) {
        answerPush(answer);
        setCount(count + 1);
        setAnswer(null);
        setMessage(null);
      } else {
        setMessage("Please select any option");
      }
    }
  };

  //POP OVER
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <section class="hero is-primary is-fullheight">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-mobile is-centered">
            <div class="column is-half">
              <div class="has-text-centered">
                <h1 class="title has-text-centered">{title}</h1>
                <h7 class="subtitle has-text-centered is-uppercase is-7 navigation">
                  QUESTION {count + 1} OF {data.length}
                </h7>
                <h5 class="subtitle has-text-centered is-5">
                  {data[count].question}
                </h5>
                {data[count].options.map((el, i) => {
                  return (
                    <p
                      class={`option ${
                        answer == i + 1 ? "answer" : ""
                      } has-text-grey-dark`}
                      onClick={(e) => setAnswer(i + 1)}
                    >
                      <span class="has-text-weight-bold is-size-5">
                        {i + 1}
                      </span>{" "}
                      {el}
                    </p>
                  );
                })}
                <div>
                  <p style={{ color: "red" }}>{message ? message : ""}</p>
                  {!completed ? (
                    <>
                      <Button
                        aria-describedby={id}
                        variant="contained"
                        color="primary"
                        onClick={() => submit()}
                      >
                        Submit
                      </Button>
                    </>
                  ) : (
                    ""
                  )}

                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <Typography className={classes.typography}>
                      The content of the Popover.
                    </Typography>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
