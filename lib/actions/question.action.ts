"use server"
import {
  GetQuestionsParams,
  CreateQuestionParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
  DeleteQuestionParams,
  EditQuestionParams,
  RecommendedParams,
} from "./shared.types.d"

import { connectToDatabase } from "../mongoose"
import Question from "../database/question.model"
import Tag from "../database/tag.model"
import User from "../database/user.model"
import { revalidatePath } from "next/cache"
import Answer from "../database/answer.model"
import Interaction from "../database/interaction.model"
import { FilterQuery } from "mongoose"

// all server actions

export async function getQuestions(params: GetQuestionsParams) {
  try {
    const { page = 1, pageSize = 20, searchQuery, filter } = params
    connectToDatabase() // no need await here
    // get all questions
    // searchQuery: pattern should match the title or explanation
    const query: FilterQuery<typeof Question> = {}
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(`${searchQuery}`, "i") } },
        { explanation: { $regex: new RegExp(`${searchQuery}`, "i") } },
      ]
    }

    let sortOptions = {}
    switch (filter) {
      case "unanswered":
        query.answers = { $size: 0 } // {answers: {$size: 0} }
        break
      case "frequent":
        sortOptions = { views: -1 }
        break
      case "recommended":
        sortOptions = { views: -1 }
        break
      default: // newest
        sortOptions = { createdAt: -1 }
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag }) // for those referenced fields, populate them so that we can see the details
      .populate({ path: "author", model: User })
      .sort(sortOptions) // sort by createdAt in descending order);
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalCount = await Question.countDocuments(query)

    // return response
    return { questions, totalCount }
  } catch (error) {
    console.log(error)
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to DB
    await connectToDatabase()

    const { title, explanation, tags, author, path } = params
    // validate data
    // save to DB, first insert a question
    const question = await Question.create({
      title,
      explanation,
      //   tags,
      author,
    })

    // use the newly created question's id to create the tags
    const tagDocuments = []
    // create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag._id)
    }

    // update question to include the tags
    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: {
          tags: { $each: tagDocuments },
        },
      },
      { new: true } // return the updated document, although here there is no return
    )

    // TODO: create an interation record for the user's ask_question action
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    })
    // increment author's reputation
    await User.findByIdAndUpdate(
      author,
      { $inc: { reputation: 5 } },
      { new: true }
    )

    console.log("new question saved to DB")
    // reload the home page to show the newly created question
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    // connect to DB
    connectToDatabase() // no need await here
    const question = await Question.findById(params.questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" }) // for those referenced fields, populate them so that we can see the details
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
    // have to comment out the following two lines, otherwise it will cause unmatched user Id for vote
    // .populate("upvotes")
    // .populate("downvotes");
    // return response
    return { question }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// the action is triggered when user click the upvote button, it should toggle the upvote status
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params
    console.log("debug upvoteQuestion", params)

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
      updateQuery = {
        $addToSet: { upvotes: userId },
      }
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })

    if (!question) {
      throw new Error("Question not found")
    }

    // increment voter's reputation by +1/-1 for upvote/downvote
    await User.findByIdAndUpdate(
      userId,
      { $inc: { reputation: hasupVoted ? -1 : 1 } },
      { new: true }
    )
    // increment author's reputation by +10/-10 for receiving upvote/downvote
    await User.findByIdAndUpdate(
      question.author,
      { $inc: { reputation: hasupVoted ? -10 : 10 } },
      { new: true }
    )

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params
    // console.log("debug downvoteQuestion", params)
    // connect to DB
    connectToDatabase() // no need await here

    let updateQuery = {}

    if (hasdownVoted) {
      // toggle downvote, remove from downvotes
      updateQuery = {
        $pull: { downvotes: userId },
      }
    } else if (hasupVoted) {
      // user upvoted before, now need to remove from upvote and add to downvote
      updateQuery = {
        $addToSet: { downvotes: userId },
        $pull: { upvotes: userId },
      }
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      }
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })

    if (!question) {
      throw new Error("Question not found")
    }

    // TODO: increment voter's reputation
    if (question.author.toString() !== userId) {
      // add +2 to the voter's reputation
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      })

      // add +10 to the author(the one who write the answer)'s reputation
      await User.findByIdAndUpdate(question.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      })
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    // connect to DB
    connectToDatabase() // no need await here
    const { questionId, path } = params
    // delete question
    // const question = await Question.findByIdAndDelete(JSON.parse(questionId));
    // if (!question) {
    //   throw new Error("Question not found");
    // }
    await Question.deleteOne({ _id: questionId })
    // also need to delete answers to this question
    await Answer.deleteMany({ question: questionId })

    // delete interfactions
    await Interaction.deleteMany({ question: questionId })

    // update tags to not reference this question
    await Tag.updateMany(
      { questions: questionId },
      {
        $pull: { questions: questionId },
      }
    )

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase()
    const { questionId, title, explanation, tags, path } = params
    // find the question and get the existing tags
    const existingQuestion = await Question.findById(questionId)
    // .populate({
    //   path: "tags",
    //   model: Tag,
    // });
    if (!existingQuestion) {
      throw new Error("Question not found")
    }
    // console.log("existingQuestion", existingQuestion);
    // existingQuestion.title = title;
    // existingQuestion.explanation = explanation;
    // await existingQuestion.save();

    const existingTags = existingQuestion.tags
    // delete the question from the existing tags
    await Tag.updateMany(
      { _id: { $in: existingTags } },
      {
        $pull: { questions: questionId },
      }
    )
    // delete existing tags from the question
    await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $pull: { tags: { $in: existingTags } },
      }
    )

    const tagDocuments = []
    // create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: questionId } },
        { upsert: true, new: true }
      )

      tagDocuments.push(existingTag._id)
    }

    // update question to include the new tags

    await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $set: { title, explanation },
        $addToSet: { tags: { $each: tagDocuments } },
      }
    )
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
// get top 5 questions by views and upvotes
export async function getTopQuestions() {
  try {
    // connect to DB
    connectToDatabase() // no need await here
    const questions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5) // sort by createdAt in descending order);
    // return response
    return questions
  } catch (error) {
    console.log(error)
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase()

    const { userId, page = 1, pageSize = 20, searchQuery } = params

    // find user
    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      throw new Error("user not found")
    }

    const skipAmount = (page - 1) * pageSize

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec()

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags)
      }
      return tags
    }, [])

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ]

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    }

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ]
    }

    const totalQuestions = await Question.countDocuments(query)

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize)

    // const isNext = totalQuestions > skipAmount + recommendedQuestions.length

    return { questions: recommendedQuestions, totalCount: totalQuestions }
  } catch (error) {
    console.error("Error getting recommended questions:", error)
    throw error
  }
}
