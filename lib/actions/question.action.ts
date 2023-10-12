// all server actions
"use server";

import { connectToDatabase } from "../mongoose";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
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
