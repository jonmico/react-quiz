import { IQuestion } from '../interfaces/question.interface';

interface OptionsProps {
  question: IQuestion;
}

export default function Options({ question }: OptionsProps) {
  return (
    <div className='options'>
      {question.options.map((option) => (
        <button className='btn btn-option' key={option}>
          {option}
        </button>
      ))}
    </div>
  );
}
