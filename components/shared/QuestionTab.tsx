import React from "react"
import QuestionCard from "../cards/QuestionCard"
import { SearchParamsProps } from "@/types"
import { getUserQuestions } from "@/lib/actions/user.action"
import Pagination from "./Pagination"

interface QuestionTabProps extends SearchParamsProps {
  userId: string
  clerkId?: string | null
  // searchParams: any;
}
const pageSize = 2
const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const page = searchParams?.page ? +searchParams.page : 1

  const result = await getUserQuestions({
    userId,
    page,
    pageSize,
  })
  // console.log("debug question tab clerkId: ", clerkId);
  const totalPage = Math.ceil(result.totalQuestions / pageSize)
  const isNext = totalPage > page
  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}

      {/* Pagination */}
      <div className="mt-10 flex-center">
        <Pagination pageNumber={page} isNext={isNext} />
      </div>
    </>
  )
}

export default QuestionTab
