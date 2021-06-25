import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import { Button } from "../components/Button";
import { useHistory, useParams } from "react-router-dom";

import "../styles/room.scss";
import { RoomCode } from "./../components/RoomCode";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../service/firebase";

type RoomParams = {
  id: string;
};

type QuestionProps = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighLighted: boolean;
  isAnswered: boolean;
};

export const AdminRoom = () => {
  const history = useHistory();
  const { id } = useParams<RoomParams>();

  const { questions, title } = useRoom(id);

  const handleEndRoom = async () => {
    await database.ref(`rooms/${id}`).update({
      endedAt: new Date(),
    });

    history.push('/')
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${id}/questions/${questionId}`).remove();
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={id} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>

          <span>
            {questions.length === 1
              ? `${questions.length} pergunta`
              : `${questions.length} perguntas`}
          </span>
        </div>

        <div className="question-list">
          {questions.map((question: QuestionProps) => (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
            >
              <button
                onClick={() => handleDeleteQuestion(question.id)}
                type="button"
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};
