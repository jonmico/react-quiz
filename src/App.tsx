import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

interface AppState {
  questions: [];
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: string;
}

const initialState: AppState = {
  questions: [],
  status: 'loading',
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

export type AppActions = DataReceived | DataFailed | StartQuiz;

function reducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    default:
      throw new Error('Action unknown.');
  }
}

export default function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
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
        {status === 'active' && <Question />}
      </Main>
    </div>
  );
}
