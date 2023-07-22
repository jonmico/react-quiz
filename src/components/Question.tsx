import { IQuestion } from '../interfaces/question.interface';
import Options from './Options';

interface QuestionProps {
  question: IQuestion;
}

export default function Question({ question }: QuestionProps) {
  console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}
