import { useEffect, useReducer } from 'react';
import { IQuestion } from './interfaces/question.interface';
import Header from './components/Header';
import Main from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/StartScreen';
import Question from './components/Question';

interface AppState {
  questions: IQuestion[];
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: string;
  index: number;
  answer: null | number;
  points: number;
}

const initialState: AppState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
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

export type AppActions = DataReceived | DataFailed | StartQuiz | NewAnswer;

function reducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
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
    default:
      throw TypeError('Action unknown.');
  }
}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;

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
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}
