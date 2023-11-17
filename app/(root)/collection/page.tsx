import QuestionCard from "@/components/cards/QuestionCard"
import Filter from "@/components/shared/Filter"
import Pagination from "@/components/shared/Pagination"
import LocalSearch from "@/components/shared/search/LocalSearch"
import NoResult from "@/components/shared/search/NoResult"
import { QuestionFilters } from "@/context/filters"
import { getSavedQuestions } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"
import { auth } from "@clerk/nextjs"

const pageSize = 2
export default async function CollectionPage({
  searchParams,
}: SearchParamsProps) {
  const { userId: clerkId } = auth()
  if (!clerkId) return null

  const page = searchParams?.page ? +searchParams.page : 1

  const result = (await getSavedQuestions({
    clerkId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page,
    pageSize,
  })) || { questions: [], totalCount: 0 }

  // console.log("debug collection getSavedQuestions: ", result.totalCount)

  const totalPages = Math.ceil(result.totalCount / pageSize)

  return (
    <>
      {/* heading */}
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>

      {/* search question */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses=""
        />
        {/* Filters, in smaller screen, it's a selection appear on the right side of question search */}
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      {/* Questions */}
      <div className="mt-11 flex w-full flex-col gap-5 ">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
            title="No saved questions found"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex-center">
        <Pagination pageNumber={page} isNext={totalPages > page} />
      </div>
    </>
  )
}
