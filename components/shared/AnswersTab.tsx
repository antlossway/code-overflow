import { SearchParamsProps } from "@/types";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
  searchParams: any;
}
const AnswersTab = async ({
  searchParams,
  userId,
  clerkId,
}: AnswersTabProps) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  });

  const { totalAnswers, answers } = result;

  //   console.log("debug answers tab: ", result);

  return (
    <>
      {answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          question={answer.question}
          clerkId={clerkId}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswersTab;
