import { useEffect, useState } from "react";
import { database } from "../service/firebase";
import { useAuth } from "./useAuth";

type firebaseQuestion = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
    likes: Record<string, { authorId: string }>;
  }
>;

type QuestionProps = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isHighLighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export const useRoom = (id: string) => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionProps[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${id}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const databaseQuestions =
        (databaseRoom.questions as firebaseQuestion) ?? {};

      const parsedQuestion = Object.entries(databaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighLighted: value.isHighLighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestion);
    });

    return () => {
      roomRef.off("value");
    };
  }, [id, user?.id]);

  return { questions, title };
};
