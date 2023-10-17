"use server";
import { connectToDatabase } from "../mongoose";
import Answer from "../database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "../database/question.model";

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });

    //   also can write like this:
    // .populate("author", "_id clerkId name picture")

    return answers;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    // console.log("debug createAnswer params.path:", path);

    const answer = await Answer.create({
      content,
      author,
      question, // questionId
    });
    // await answer.save();
    console.log("new answer saved to DB: ", answer);

    // update question to include the answer
    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    console.log("question updated with new answer");

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    // console.log("debug upvoteAnswer", params);

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

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: increment voter's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    // console.log("debug downvoteAnswer", params);

    // connect to DB
    connectToDatabase(); // no need await here

    let updateQuery = {};

    if (hasdownVoted) {
      // toggle downvote
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      // user downvoted before, now need to remove from downvote and add to upvote
      updateQuery = {
        // $push: { upvotes: userId },
        $addToSet: { downvotes: userId },
        $pull: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // TODO: increment voter's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
