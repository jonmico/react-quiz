import { AppActions } from '../App';

interface NextButtonProps {
  answer: number | null;
  index: number;
  numQuestions: number;
  dispatch: React.Dispatch<AppActions>;
}

export default function NextButton({
  dispatch,
  answer,
  index,
  numQuestions,
}: NextButtonProps) {
  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'finish' })}
      >
        Finish
      </button>
    );
}
