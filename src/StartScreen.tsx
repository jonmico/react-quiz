import { AppActions } from './App';

interface StartScreenProps {
  numQuestions: number;
  dispatch: React.Dispatch<AppActions>;
}

export default function StartScreen({
  numQuestions,
  dispatch,
}: StartScreenProps) {
  return (
    <div className='start'>
      <h2>Welcome to the React Quix!</h2>
      <h3>{numQuestions} question to test your React mastery</h3>
      <button
        className='btn btn-ui-class'
        onClick={() => dispatch({ type: 'start' })}
      >
        Let's Start
      </button>
    </div>
  );
}
