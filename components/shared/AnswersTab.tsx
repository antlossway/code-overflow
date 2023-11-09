import { SearchParamsProps } from "@/types"
import { getUserAnswers } from "@/lib/actions/user.action"
import AnswerCard from "../cards/AnswerCard"
import Pagination from "./Pagination"

interface AnswersTabProps extends SearchParamsProps {
  userId: string
  clerkId?: string | null
  searchParams: { [key: string]: string | undefined }
}

const pageSize = 2
const AnswersTab = async ({
  searchParams,
  userId,
  clerkId,
}: AnswersTabProps) => {
  const page = searchParams?.page ? +searchParams.page : 1

  const result = await getUserAnswers({
    userId,
    page,
    pageSize,
  })

  const { totalAnswers, answers } = result
  const totalPages = Math.ceil(totalAnswers / pageSize)
  const isNext = totalPages > page

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

      {/* Pagination */}
      <div className="mt-10 flex-center">
        <Pagination pageNumber={page} isNext={isNext} />
      </div>
    </>
  )
}

export default AnswersTab
