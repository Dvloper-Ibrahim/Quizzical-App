import React from "react";
import Question from "./components/Question";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./App.css";

function App() {
  // Declaring Some States
  const [questions, setQuestions] = React.useState([]);
  const [result, setResult] = React.useState(false);
  const [inputs, setInputs] = React.useState({
    category: "",
    number: "",
    type: "",
    level: "",
  });
  const [notSelected, setNotSelected] = React.useState(false);

  // Declaring Assisting Variables
  let score = questions.filter((ques) => ques.isTrueChoice).length;
  let fullScore = score === questions.length;

  // Function To Reset States To Defaults And Return To Start Page
  function returnToStartPage() {
    setResult(false);
    setQuestions([]);
  }

  // Function To Reveal The Correct Answers
  function checkResults() {
    let allAnswered = questions.every((e) => e.choice !== "");
    if (result) {
      setResult(false);
      getQuestions();
    } else {
      if (allAnswered) {
        setResult(true);
      } else {
        let notes = document.querySelector(".result p");
        notes.style.display = "block";
        notes.innerHTML = "Please, answer all of the questions";
      }
    }
  }

  // Function To Record What The User Choose
  function getAnswer(e) {
    let { name, value } = e.target;
    setQuestions((prevQuestions) =>
      prevQuestions.map((ques) =>
        name === `Question-${ques.id} Choice`
          ? {
              ...ques,
              choice: value,
              isTrueChoice: value === ques.answer,
            }
          : ques
      )
    );
  }

  // Function To Get The Questions Depending On The User Inputs
  async function getQuestions() {
    let noInput = [
      inputs.category,
      inputs.number,
      inputs.type,
      inputs.level,
    ].some((e) => e === "-- Choose --" || e === "");
    let notANumber = [
      inputs.category,
      inputs.number,
      inputs.type,
      inputs.level,
    ].some((e) => e < 1 || e > 50);

    // Checking For Vaild Inputs
    if (noInput || notANumber) setNotSelected(true);
    else {
      setNotSelected(false);
      let res = await fetch(
        `https://opentdb.com/api.php?amount=${inputs.number}&category=${inputs.category}&difficulty=${inputs.level}&type=${inputs.type}`
      );
      let data = await res.json();
      setQuestions(
        data.results.map((obj, i) => ({
          id: i + 1,
          question: obj.question,
          answer: obj.correct_answer,
          choices: prepareChoices(obj),
          choice: "",
          isTrueChoice: false,
        }))
      );
    }
  }

  // Function To Arrange Choices Randomly
  function prepareChoices(question) {
    let random = Math.floor(Math.random() * 4);
    let corrAnswer = question.correct_answer;
    let choices = question.incorrect_answers.map((e) => e);
    choices.splice(random, 0, corrAnswer);
    return choices;
  }

  // Function To Record The User Inputs on which The Questions Depend
  function getInputs(e) {
    const { name, value, type } = e.target;
    setInputs((oldInputs) => ({
      ...oldInputs,
      [name]: type === "number" ? Math.round(value) : value,
    }));
  }

  // Compose The Questions Components
  let quiz = questions.map((ques) => (
    <Question
      key={nanoid()}
      id={ques.id}
      question={ques.question}
      choices={ques.choices}
      correctAnswer={ques.answer}
      chosen={ques.choice}
      isTrue={ques.isTrueChoice}
      check={result}
      handleChoice={getAnswer}
    />
  ));

  return (
    <main>
      {result && fullScore && (
        <Confetti height={document.body.clientHeight + 60} />
      )}
      {questions.length > 0 ? (
        <div className="questions-page">
          {quiz}
          <div className="result">
            <p style={{ display: result ? "block" : "none" }}>
              {result && fullScore
                ? `Wonderful !!
                All your choices are right.`
                : result
                ? `You scored ${score}/${questions.length} correct answers.`
                : ""}
            </p>
            <button onClick={checkResults} className="end">
              {result ? "Play again" : "Check answers"}
            </button>
          </div>
          <button onClick={returnToStartPage} className="return">
            Return to start page
          </button>
        </div>
      ) : (
        <div className="start-page">
          <h1>Quizzical</h1>
          <div className="quiz-description">
            <p>This quiz tests your knowledge in many scopes.</p>
            <p>Choose how you want to test yourself.</p>
          </div>
          <div className="inputs">
            <div>
              <p>Select the category</p>
              <select name="category" onChange={getInputs}>
                <option>-- Choose --</option>
                <option value="9">General Knowledge</option>
                <option value="17">Science : Nature</option>
                <option value="18">Science : Computers</option>
                <option value="19">Science : Mathematics</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
              </select>
            </div>
            <div>
              <p>Write the number of questions</p>
              <input
                type="number"
                name="number"
                onChange={getInputs}
                min="1"
                max="50"
                placeholder="Input a number between 1 : 50"
              />
            </div>
            <div>
              <p>Select the type</p>
              <select name="type" onChange={getInputs}>
                <option>-- Choose --</option>
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True / False</option>
              </select>
            </div>
            <div>
              <p>Select the level</p>
              <select name="level" onChange={getInputs}>
                <option>-- Choose --</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <p style={{ display: notSelected ? "block" : "none" }}>
            Sorry, there are missing or invalid inputs
          </p>
          <button onClick={getQuestions} className="start">
            Start quiz
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
