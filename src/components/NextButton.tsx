import { AppActions } from '../App';

interface NextButtonProps {
  answer: number | null;
  dispatch: React.Dispatch<AppActions>;
}

export default function NextButton({ dispatch, answer }: NextButtonProps) {
  if (answer === null) return null;

  return (
    <button
      className='btn btn-ui'
      onClick={() => dispatch({ type: 'nextQuestion' })}
    >
      Next
    </button>
  );
}
