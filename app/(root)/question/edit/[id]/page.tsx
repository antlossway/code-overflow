import Question from "@/components/forms/Question"
import { ParamsProps } from "@/types"
import React from "react"
import { auth } from "@clerk/nextjs"
import { getQuestionById } from "@/lib/actions/question.action"
import { getUserById } from "@/lib/actions/user.action"

const EditQuestion = async ({ params }: ParamsProps) => {
  const { userId } = auth() // clerkId
  if (!userId) return null
  const mongoUser = await getUserById({ userId })

  const question = await getQuestionById({
    questionId: params.id,
  })

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </div>
  )
}

export default EditQuestion
