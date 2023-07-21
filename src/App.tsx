import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';

interface AppState {
  questions: [];
  // 'loading', 'error', 'ready', 'finished'
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

type AppActions = DataReceived | DataFailed;

function reducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    default:
      throw new Error('Action unknown.');
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

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
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}
