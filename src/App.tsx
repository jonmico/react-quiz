import { useEffect, useReducer } from 'react';
import { IQuestion } from './interfaces/question.interface';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';

interface AppState {
  questions: IQuestion[];
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: string;
  index: number;
  answer: null | number;
  points: number;
  highScore: number;
  secondsRemaining: number | null;
}

const SECONDS_PER_QUESTION = 30;

const initialState: AppState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

type DataReceived = {
  type: 'dataReceived';
  payload: [];
};

type DataFailed = {
  type: 'dataFailed';
};

type StartQuiz = {
  type: 'start';
};

type NewAnswer = {
  type: 'newAnswer';
  payload: number;
};

type NextQuestion = {
  type: 'nextQuestion';
};

type Finished = {
  type: 'finish';
};

type Restart = {
  type: 'restart';
};

type Tick = {
  type: 'tick';
};

export type AppActions =
  | DataReceived
  | DataFailed
  | StartQuiz
  | NewAnswer
  | NextQuestion
  | Finished
  | Restart
  | Tick;

function reducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case 'newAnswer': {
      const question: IQuestion | undefined = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question?.correctOption
            ? state.points + question?.points
            : state.points,
      };
    }
    case 'nextQuestion':
      return { ...state, index: state.index++, answer: null };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case 'restart':
      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining! - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      throw TypeError('Action unknown.');
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc: number, curr: IQuestion) => acc + curr.points,
    0
  );

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('http://localhost:8000/questions');
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (err) {
        dispatch({ type: 'dataFailed' });
      }
    }
    fetchQuestions();
  }, []);
  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              maxPossiblePoints={maxPossiblePoints}
              points={points}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
