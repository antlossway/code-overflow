import QuestionCard from "@/components/cards/QuestionCard"
import Pagination from "@/components/shared/Pagination"
import LocalSearch from "@/components/shared/search/LocalSearch"
import NoResult from "@/components/shared/search/NoResult"
import { getQuestionsByTagId } from "@/lib/actions/tag.action"
import { IQuestion } from "@/lib/database/question.model"
import React from "react"

interface Props {
  params: { tagId: string }
  searchParams: { [key: string]: string | undefined }
}

const pageSize = 2
const TagDetailPage = async ({ params, searchParams }: Props) => {
  const page = searchParams?.page ? +searchParams.page : 1
  const { tagId } = params
  const result = await getQuestionsByTagId({
    tagId,
    page,
    pageSize,
    searchQuery: searchParams.q,
  })
  // console.log("debug getQuestionsByTagId: ", result)
  const totalPages = Math.ceil(result.totalCount / pageSize)
  const isNext = totalPages > page // is there still a next page

  return (
    <>
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900 capitalize">
          {result.tagTitle}
        </h1>
      </div>

      {/* search tag */}
      <div className="mt-11 w-full">
        <LocalSearch
          route={`/tags/${tagId}`}
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions..."
          otherClasses="flex-1"
        />
      </div>

      {/* questions */}
      {/* Questions */}
      <div className="mt-11 flex w-full flex-col gap-5 ">
        {result.questions.length > 0 ? (
          result.questions.map((question: IQuestion) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="No tag questions found"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex-center">
        <Pagination pageNumber={page} isNext={isNext} />
      </div>
    </>
  )
}

export default TagDetailPage
