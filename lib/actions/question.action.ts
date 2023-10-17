// all server actions
"use server";

import { connectToDatabase } from "../mongoose";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "../database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    // connect to DB
    connectToDatabase(); // no need await here
    // get all questions
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag }) // for those referenced fields, populate them so that we can see the details
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 }); // sort by createdAt in descending order);
    // return response
    return { questions };
  } catch (error) {
    console.log(error);
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to DB
    await connectToDatabase();

    const { title, explanation, tags, author, path } = params;
    // validate data
    // save to DB, first insert a question
    const question = await Question.create({
      title,
      explanation,
      //   tags,
      author,
    });

    // use the newly created question's id to create the tags
    const tagDocuments = [];
    // create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // update question to include the tags
    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: { $each: tagDocuments },
      },
    });

    // TODO: create an interation record for the user's ask_question action

    // increment author's reputation

    await question.save();
    console.log("new question saved to DB");
    // reload the home page to show the newly created question
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    // connect to DB
    connectToDatabase(); // no need await here
    const question = await Question.findById(params.questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" }) // for those referenced fields, populate them so that we can see the details
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    // have to comment out the following two lines, otherwise it will cause unmatched user Id for vote
    // .populate("upvotes")
    // .populate("downvotes");
    // return response
    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// the action is triggered when user click the upvote button, it should toggle the upvote status
export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    console.log("debug upvoteQuestion", params);

    // connect to DB
    connectToDatabase(); // no need await here

    let updateQuery = {};

    if (hasupVoted) {
      // user upvoted before, now need to cancel upvote
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      // user downvoted before, now need to remove from downvote and add to upvote
      updateQuery = {
        // $push: { upvotes: userId },
        $addToSet: { upvotes: userId },
        $pull: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // TODO: increment voter's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    console.log("debug downvoteQuestion", params);
    // connect to DB
    connectToDatabase(); // no need await here

    let updateQuery = {};

    if (hasdownVoted) {
      // toggle downvote, remove from downvotes
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      // user upvoted before, now need to remove from upvote and add to downvote
      updateQuery = {
        $addToSet: { downvotes: userId },
        $pull: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // TODO: increment voter's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
