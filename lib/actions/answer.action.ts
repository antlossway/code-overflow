"use server"
import { connectToDatabase } from "../mongoose"
import Answer from "../database/answer.model"
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types"
import { revalidatePath } from "next/cache"
import Question from "../database/question.model"
import Interaction from "../database/interaction.model"
import User from "../database/user.model"

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase()
    const { questionId, sortBy, page = 1, pageSize = 2 } = params

    let sortOptions = {}
    switch (sortBy) {
      case "highest_upvotes":
        sortOptions = { upvotes: 1 }
        break
      case "lowest_upvotes":
        sortOptions = { upvotes: 1 }
        break
      case "most_recent":
        sortOptions = { createdAt: -1 }
        break
      case "oldest":
        sortOptions = { createdAt: 1 }
        break
      default: // newest
        sortOptions = { createdAt: -1 }
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name picture",
      })
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalCount = await Answer.countDocuments({ question: questionId })

    //   also can write like this:
    // .populate("author", "_id clerkId name picture")
    if (!answers) {
      throw new Error(`Answers not found for questionId ${questionId}`)
    }

    // console.log("debug getAnswers for questionId", questionId);
    return { answers, totalCount }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase()
    const { content, author, question, path } = params // question is questionId
    // console.log("debug createAnswer params.path:", path);

    const answer = await Answer.create({
      content,
      author,
      question, // questionId
    })
    // await answer.save();
    // console.log("new answer saved to DB: ", answer)

    // update question to include the answer
    const questionObj = await Question.findByIdAndUpdate(
      question,
      {
        $push: { answers: answer._id },
      },
      { new: true }
    )

    // add interaction
    await Interaction.create({
      user: author,
      action: "answer",
      question, // questionId
      answer: answer._id,
      tags: questionObj.tags,
    })

    // add reputation to author of the answer
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params
    // console.log("debug upvoteAnswer", params);

    // connect to DB
    connectToDatabase() // no need await here

    let updateQuery = {}

    if (hasupVoted) {
      // user upvoted before, now need to cancel upvote
      updateQuery = {
        $pull: { upvotes: userId },
      }
    } else if (hasdownVoted) {
      // user downvoted before, now need to remove from downvote and add to upvote
      updateQuery = {
        // $push: { upvotes: userId },
        $addToSet: { upvotes: userId },
        $pull: { downvotes: userId },
      }
    } else {
      // user has not voted before
      updateQuery = {
        $addToSet: { upvotes: userId },
      }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) {
      throw new Error("Answer not found")
    }

    // TODO: increment voter's reputation, if voter is not the author of the answer, add +2 to the voter's reputation, and add +10 to the author(the one who write the answer)'s reputation
    if (answer.author.toString() !== userId) {
      // add +2 to the voter's reputation
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      })

      // add +10 to the author(the one who write the answer)'s reputation
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      })
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params
    // console.log("debug downvoteAnswer", params);

    // connect to DB
    connectToDatabase() // no need await here

    let updateQuery = {}

    if (hasdownVoted) {
      // toggle downvote
      updateQuery = {
        $pull: { downvotes: userId },
      }
    } else if (hasupVoted) {
      // user downvoted before, now need to remove from downvote and add to upvote
      updateQuery = {
        // $push: { upvotes: userId },
        $addToSet: { downvotes: userId },
        $pull: { upvotes: userId },
      }
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) {
      throw new Error("Answer not found")
    }

    // TODO: increment voter's reputation
    if (answer.author.toString() !== userId) {
      // add +2 to the voter's reputation
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? 2 : -2 },
      })

      // add +10 to the author(the one who write the answer)'s reputation
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasdownVoted ? 10 : -10 },
      })
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    // connect to DB
    connectToDatabase() // no need await here
    const { answerId, path } = params

    const answer = await Answer.findById(answerId)
    if (!answer) {
      throw new Error("Answer not found")
    }
    // delete the answer
    await Answer.deleteOne({ _id: answerId })

    // update question
    await Question.updateMany(
      { _id: answer.question },
      {
        $pull: { answers: answerId },
      }
    )

    // delete interaction
    await Interaction.deleteMany({ answer: answerId })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
