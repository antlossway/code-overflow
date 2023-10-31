"use server"
import { FilterQuery } from "mongoose"

import {
  GetSavedQuestionsParams,
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
  GetUserByIdParams,
  GetUserStatsParams,
} from "./shared.types.d"

import { connectToDatabase } from "../mongoose"
import User from "../database/user.model"
import { revalidatePath } from "next/cache"
import Question from "../database/question.model"
import console from "console"
import Tag from "../database/tag.model"
import Answer from "../database/answer.model"

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase()

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const { searchQuery } = params
    const query: FilterQuery<typeof User> = {}
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ]
    }

    // newly created user will be on top
    const users = await User.find(query).sort({ createdAt: -1 })

    return { users }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserById(params: any) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ clerkId: userId })

    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      throw new Error("User not found")
    }

    const totalQuestions = await Question.countDocuments({
      author: user._id,
    })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    return { user, totalQuestions, totalAnswers }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase()

    const newUser = await User.create(userData)
    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase()

    const { clerkId, updateData, path } = params

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true, // return the object with the updated data
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase()

    const { clerkId } = params

    const user = await User.findOneAndDelete({ clerkId })

    if (!user) {
      throw new Error("User not found")
    }
    // delete user from all the questions, answers, comments, etc.
    // TODO: get user question ids
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id })

    // TODO: delete user answers, comments

    const deletedUser = await User.findByIdAndDelete(user._id)
    return deletedUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, userId, path } = params
    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }
    const isQuestionSaved = user.savedPosts.includes(questionId)
    if (isQuestionSaved) {
      // remove question
      await User.findByIdAndUpdate(
        userId,
        { $pull: { savedPosts: questionId } },
        { new: true }
      )
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedPosts: questionId } },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params
    connectToDatabase()

    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { explanation: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {}

    const user = await User.findOne({ clerkId }).populate({
      path: "savedPosts",
      match: query,
      options: {
        sort: { createdAt: -1 },
        // paging
      },
      // embedded populate on each question
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })

    if (!user) {
      throw new Error("User not found")
    }
    return { questions: user.savedPosts }
  } catch (error) {}
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase()
    const { userId, page = 1, pageSize = 10 } = params
    const totalQuestions = await Question.countDocuments({ author: userId })
    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
    // .skip((page-1)*pageSize).limit(pageSize);

    return { totalQuestions, questions: userQuestions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase()
    const { userId, page = 1, pageSize = 10 } = params
    const totalAnswers = await Answer.countDocuments({ author: userId })
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({
        path: "question",
        model: Question,
        select: "_id title",
      })
    // .skip((page-1)*pageSize).limit(pageSize);

    return { totalAnswers, answers: userAnswers }
  } catch (error) {
    console.log(error)
    throw error
  }
}
