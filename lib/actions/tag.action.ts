"use server";

import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    // find interatctions for the user and group by tags
    // TODO: add new model Interaction

    const tags = [
      { _id: "1", name: "css" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "nodejs" },
    ];

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
