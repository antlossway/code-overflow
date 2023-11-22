import React from "react"
import RenderTag from "../shared/RenderTag"
import Link from "next/link"
import Metric from "../shared/Metric"
import { formatBigNumber, getTimesAgo } from "@/lib/utils"
import { SignedIn } from "@clerk/nextjs"
import EditDeleteAction from "../shared/EditDeleteAction"

type QuestionCardProps = {
  _id: string
  title: string
  tags?: {
    _id: string
    name: string
  }[]
  author: {
    _id: string
    clerkId: string
    name: string
    picture: string
  }
  upvotes: Array<object>
  answers?: Array<object>
  views?: number
  createdAt: Date
  clerkId?: string | null
}
const QuestionCard = ({
  _id,
  clerkId,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionCardProps) => {
  // console.log("debug clerkId vs author.clerkId: ", clerkId, author.clerkId);

  return (
    <div className="card-wrapper rounded-lg p-6 sm:px-11 ">
      {/* createdAt and Title */}
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {/* on mobile device, createdAt date is on top */}
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimesAgo(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* if signed in, add edit/delete action */}
        <SignedIn>
          {clerkId && clerkId === author.clerkId && (
            // <div className="w-full flex items-center justify-end gap-1">
            //   <EditButton id={JSON.stringify(_id)} type="Question" />
            //   <DeleteButton id={JSON.stringify(_id)} type="Question" />
            // </div>
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      {/* tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <RenderTag key={tag.name} _id={tag._id} name={tag.name} />
        ))}
      </div>

      {/* author and statistics */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          // imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={author.name}
          title={` - asked ${getTimesAgo(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author._id}`}
          isAuthor={true}
        />

        {/* statistics go to the right side */}
        <div className="flex items-center gap-3 max-sm:flex-wrap  ">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={formatBigNumber(upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          {answers && (
            <Metric
              imgUrl="/assets/icons/message.svg"
              alt="messages"
              value={formatBigNumber(answers.length)}
              title=" Answers"
              textStyles="small-medium text-dark400_light800"
            />
          )}

          {views && (
            <Metric
              imgUrl="/assets/icons/eye.svg"
              alt="eye"
              value={formatBigNumber(views)}
              title=" Views"
              textStyles="small-medium text-dark400_light800"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
