import { AppActions } from '../App';
import { IQuestion } from '../interfaces/question.interface';
import Options from './Options';

interface QuestionProps {
  question: IQuestion;
  answer: null | number;
  dispatch: React.Dispatch<AppActions>;
}

export default function Question({
  question,
  dispatch,
  answer,
}: QuestionProps) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}
