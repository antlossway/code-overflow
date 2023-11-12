"use server"

import Tag from "../database/tag.model"
import User from "../database/user.model"
import { connectToDatabase } from "../mongoose"
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types"
import Question from "../database/question.model"
import mongoose, { FilterQuery } from "mongoose"

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()

    const { searchQuery, filter, page = 1, pageSize = 20 } = params

    const query: FilterQuery<typeof Tag> = {}
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }]
    }

    let sortOptions = {}
    switch (filter) {
      case "oldest":
        sortOptions = { createdAt: 1 }
        break
      case "recent":
        sortOptions = { createdAt: -1 }
        break
      case "popular":
        sortOptions = { questions: -1 }
        break
      case "name":
        sortOptions = { name: 1 }
        break
      default:
        sortOptions = { createdAt: -1 }
        break
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
    const totalCount = await Tag.countDocuments(query)

    return { tags, totalCount }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase()
    const { userId } = params

    const user = await User.findById(userId)

    if (!user) {
      throw new Error("User not found")
    }
    // find interatctions for the user and group by tags
    // TODO: add new model Interaction

    const tags = [
      { _id: "1", name: "css" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "nodejs" },
    ]

    return tags
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase()
    const { tagId, page = 1, pageSize = 10, searchQuery } = params

    // const tagFilter: FilterQuery<ITag> = {_id: tagId};

    const query: FilterQuery<typeof Tag> = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { explanation: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : // { title: { $regex: new RegExp(searchQuery, "i") } }
        {}

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })

    const checkTotalCount = await Tag.aggregate([
      {
        $match: { $and: [{ _id: new mongoose.Types.ObjectId(tagId) }, query] },
      },
      {
        $project: {
          questionCount: { $size: "$questions" },
        },
      },
    ])
    const totalCount = checkTotalCount[0]?.questionCount || 0

    if (!tag) {
      throw new Error("no Tag found")
    }

    return { tagTitle: tag.name, questions: tag.questions, totalCount }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase()

    const tags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numOfQuestions: { $size: "$questions" },
        },
      },
      {
        $sort: { numOfQuestions: -1 },
      },
      {
        $limit: 10,
      },
    ])

    return tags
  } catch (error) {
    console.log(error)
    throw error
  }
}
