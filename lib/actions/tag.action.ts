"use server"

import Tag, { ITag } from "../database/tag.model"
import User from "../database/user.model"
import { connectToDatabase } from "../mongoose"
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types"
import Question from "../database/question.model"
import { FilterQuery } from "mongoose"

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()

    // const { filter } = params;

    // const tags = [
    // { _id: "1", name: "css" },
    // { _id: "2", name: "javascript" },
    // { _id: "3", name: "nodejs" },
    // ];
    const tags = await Tag.find({})

    return { tags }
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

    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, "i") } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })

    if (!tag) {
      throw new Error("no Tag found")
    }

    return { tagTitle: tag.name, questions: tag.questions }
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
