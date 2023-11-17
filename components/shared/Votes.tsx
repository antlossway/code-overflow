"use client"
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action"
import { viewQuestion } from "@/lib/actions/interaction.action"
import { downvoteQuestion, upvoteQuestion } from "@/lib/actions/question.action"
import { toggleSaveQuestion } from "@/lib/actions/user.action"
import { formatBigNumber } from "@/lib/utils"
import Image from "next/image"
// import { usePathname, useRouter } from "next/navigation";
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { toast } from "../ui/use-toast"

type VotesProps = {
  type: string // question or answer
  id: string // questionId or answerId
  voteUserId: string // originally object, but when pass props, used JSON.stringify
  upvotes: number | 0
  downvotes: number | 0
  hasupVoted: boolean
  hasdownVoted: boolean
  hasSaved?: boolean // only used for UI purpose, to change star icon style to indicate saved post
}

const Votes = ({
  type,
  id,
  voteUserId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: VotesProps) => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(id),
      userId: voteUserId ? JSON.parse(voteUserId) : undefined,
    })
    // alert("viewed");
  }, [id, voteUserId, pathname, router])

  const handleVote = async (action: string) => {
    if (!voteUserId)
      return toast({
        title: "Please sign in",
        description: "You need to sign in to vote",
      })

    const questionId = id
    const answerId = id

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(questionId),
          userId: JSON.parse(voteUserId), // ObjectId
          hasupVoted,
          hasdownVoted,
          path: pathname,
        })
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(answerId),
          userId: JSON.parse(voteUserId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        })
      }

      return toast({
        title: `Upvote ${!hasupVoted ? "Success" : "Removed"}`,
        variant: !hasupVoted ? "default" : "destructive",
      })
    } else if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(questionId),
          userId: JSON.parse(voteUserId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        })
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(answerId),
          userId: JSON.parse(voteUserId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        })
      }

      return toast({
        title: `Downvote ${!hasdownVoted ? "Success" : "Removed"}`,
        variant: !hasdownVoted ? "default" : "destructive",
      })
    }
  }

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(voteUserId),
      questionId: JSON.parse(id),
      path: pathname,
    })

    return toast({
      title: `Question ${!hasSaved ? "Success" : "Removed"}`,
      variant: !hasSaved ? "default" : "destructive",
    })
  }

  return (
    <div className="flex items-center gap-5">
      <div className="flex-center gap-2 5">
        {/* upvote */}
        <div className="flex-center gap-1 5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatBigNumber(upvotes)}
            </p>
          </div>
        </div>

        {/* downvote */}
        <div className="flex-center gap-1 5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatBigNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {/* saved post */}
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  )
}

export default Votes
