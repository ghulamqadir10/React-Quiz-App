import { useState, useEffect, useRef } from "react";
import axios from "axios";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [checkAns, setCheckAns] = useState(0);
  const [shuffle, setShuffle] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [footerPosition, setFooterPosition] = useState(false); //dont know

  let radiosRef = useRef([]); //for value
  const handleClick = (radio) => setSelectedValue(radio);

  function shuffleArray(array) {
    //function nhi aaya samaj
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function nextQuestion(index) {
    // Step 1
    if (!selectedValue) {
      alert(`please choose an answer`);
      return;
    }
    // Step 2
    if (quizQuestion[index].correctAnswer === selectedValue) {
      setCheckAns(checkAns + 1);
    }
    // Step 3
    if (index === quizQuestion.length - 1) {
      setShowResult(true);
    } else {
      setQuestionNumber(questionNumber + 1);
    }
    // Step 4
    // samaj nhi aaya
    radiosRef.current.forEach((radio) => {
      if (radio) radio.checked = false;
    });
    setSelectedValue(null);
  }

  useEffect(() => {
    if (quizQuestion.length > 0) {
      const answer = [
        ...quizQuestion[questionNumber].incorrectAnswers,
        quizQuestion[questionNumber].correctAnswer,
      ];
      setShuffle(shuffleArray([...answer]));
    }
  }, [quizQuestion, questionNumber]);

  function quiz() {
    setShowResult(false);
    setQuizQuestion([]);
    setCheckAns(0);
    setQuestionNumber(0);
    axios
      .get(`https://the-trivia-api.com/v2/questions`)
      .then((res) => {
        console.log(res.data);
        setQuizQuestion(res.data);
        setFooterPosition(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (startQuiz) {
      quiz();
      setFooterPosition(true);
    }
  }, [startQuiz]);

  return (
    <>
      <Navbar />
      {!startQuiz?(
        <>
        <h1>Welcome to the Ultimate Quiz Challenge</h1>
        <div className="quiz-sec text-center mt-20 bg-slate-300 shadow-2xl rounded-md border-indigo-600 p-12 w-fit mx-auto">
            <h3 className="text-[20px] mx-auto font-light">
              Explore random quiz questions from a variety of categories and put
              your knowledge to the test. Each quiz offers a fresh experience
              with new questions every time. Ready to see how much you know?
              Start the quiz and find out!
            </h3>
            <button
              onClick={() => setStartQuiz(true)}
              className="btn btn-outline btn-black mt-4 text-[16px]"
            >
              Start Quiz
            </button>
          </div>
        </>
      ):showResult?( <>
        <h2 className="text-center text-white text-[30px] mt-10 font-semibold">
          Result
        </h2>
        <div className="result-sec text-center w-[300px] h-[300px] rounded-full flex justify-center items-center text-[22px] m-auto mt-7">
          <p>
            Your Final Score <br /> is {checkAns} <br /> Out of{" "}
            {quizQuestion.length} <br />
            <button
              className="btn btn-outline btn-black mt-[30px]"
              onClick={quiz}
            >
              Play Again
            </button>
          </p>
        </div>
      </>):(  <>
          <h2
            style={{ letterSpacing: "3px" }}
            className="text-center text-white text-[30px] mt-10 font-semibold"
          >
            Quiz Questions
          </h2>
          <div className="quiz-sec mb-5 text-black p-[30px] rounded-md">
            {quizQuestion.length > 0 ? (
              <>
                <p className="text-[20px] font-semibold mb-4">
                  Q:{questionNumber + 1} {quizQuestion[questionNumber].question.text}
                </p>
                {shuffle.map((item, index) => (
                  <div className="mb-3" key={index}>
                    <h3>
                      <label className="cursor-pointer" htmlFor={item.id}>
                        {" "}
                        <input
                          ref={(el) => (radiosRef.current[index] = el)}
                          onChange={() => handleClick(item)}
                          type="radio"
                          name="radio-4"
                          className="radio radio-black radio-xs mr-3"
                          value={item}
                          id={item.id}
                        />
                        {item}
                      </label>
                    </h3>
                  </div>
                ))}
                <button
                  className="btn btn-outline btn-black mt-5"
                  onClick={() => nextQuestion(questionNumber)}
                >
                  Next Question
                </button>
              </>) : (
              <span className="loading loading-bars loading-lg"></span>
            ) }
              </div>
        </>
      )}
      <Footer quiz={footerPosition} />
    </>
  );
}

export default App;
