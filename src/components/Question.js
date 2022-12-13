import React from "react";
import { nanoid } from "nanoid";

export default function Question(props) {
  const trueStyle = {
    backgroundColor: "#94D7A2",
    border: "none",
    padding: "5px 11px",
  };
  const falseStyle = {
    backgroundColor: "#F8BCBC",
    border: "none",
    padding: "5px 11px",
    opacity: "0.6",
  };

  const answers = props.choices.map((choice, i) => {
    // Function To Set The Style Of Wrong Or Correct Answers
    function resultStyle() {
      if (props.check) {
        if (props.chosen === choice) {
          return props.isTrue ? trueStyle : falseStyle;
        } else return choice === props.correctAnswer ? trueStyle : {};
      }
    }

    return (
      <label key={nanoid()}>
        <input
          type="radio"
          name={`Question-${props.id} Choice`}
          value={choice}
          checked={props.chosen === choice}
          onChange={props.handleChoice}
          disabled={props.check}
        />
        <div style={resultStyle()} className="choice">
          {choice}
        </div>
      </label>
    );
  });

  return (
    <div className="question">
      <h3>
        {props.id}. {props.question}
      </h3>
      <div className="choices">{answers}</div>
    </div>
  );
}
