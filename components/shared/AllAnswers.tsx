import { getAnswers } from "@/lib/actions/answer.action"
import Image from "next/image"
import React from "react"
import ParseHTML from "./ParseHTML"
import Filter from "./Filter"
import { AnswerFilters } from "@/context/filters"
import Link from "next/link"
import { getTimesAgo } from "@/lib/utils"
import Votes from "./Votes"
import { auth } from "@clerk/nextjs"
import Pagination from "./Pagination"

type Props = {
  questionId: string
  userId: string
  totalAnswers: number
  page?: string
  filter?: string
}

const pageSize = 1
const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const { userId: clerkId } = auth()
  if (!clerkId) return

  const currentPage = page ? +page : 1 // +page convert string to number

  const { answers, totalCount } = await getAnswers({
    questionId,
    sortBy: filter,
    page: currentPage,
    pageSize,
  })
  if (!answers) return <p>No Answers</p>

  const totalPages = Math.ceil(totalCount / pageSize)
  const isNext = totalPages > currentPage

  // console.log("debug all answers: ", answers);

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>

        <Filter filters={AnswerFilters} />
      </div>

      <div className="mt-8">
        {answers.map((answer: any) => (
          <article key={answer._id} className="light-border border-b py-10">
            {/* SPAN ID */}
            <div className="mb-8 flex justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author?.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author?.picture}
                  alt="user avatar"
                  width={18}
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author?.name}
                  </p>
                  <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1 ">
                    <span className="max-sm:hidden ml-2"> -</span>
                    answered {getTimesAgo(answer.createdAt)}
                  </p>
                </div>
              </Link>
              {/* Voting */}
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  id={JSON.stringify(answer._id)}
                  voteUserId={JSON.stringify(userId)}
                  upvotes={answer.upvotes?.length}
                  downvotes={answer.downvotes?.length}
                  hasupVoted={answer.upvotes?.includes(userId) || false}
                  hasdownVoted={answer.downvotes?.includes(userId) || false}
                />
              </div>
            </div>
            {/* CONTENT */}
            <div className="mt-3.5 text-dark200_light800">
              <ParseHTML data={answer.content} />
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex-center">
        <Pagination pageNumber={currentPage} isNext={isNext} />
      </div>
    </div>
  )
}

export default AllAnswers
