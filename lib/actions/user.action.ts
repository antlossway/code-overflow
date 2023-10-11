"use server";

import { connect } from "http2";
import { connectToDatabase } from "../mongoose";
import User from "../database/user.model";

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clertId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
