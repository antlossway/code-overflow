"use server";

import { ViewQuestionParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Question from "../database/question.model";
import Interaction from "../database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, userId } = params;

    // update Question: view count for the question
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });

    // update Interaction: add view if it's the first time that the user views the question
    // check the user's existing interaction
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (existingInteraction)
        return console.log("user has already viewed this question");

      await Interaction.create({
        user: userId,
        question: questionId,
        action: "view",
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
