"use server"
import { connectToDatabase } from "../mongoose"
import Question from "../database/question.model"
import { SearchParams } from "./shared.types"
import User from "../database/user.model"
import Tag from "../database/tag.model"
import Answer from "../database/answer.model"

const SearchableTypes = ["question", "user", "answer", "tag"]
export async function globalSearch(params: SearchParams) {
  //   const result: ResultType[] = []
  console.log("globalSearch is called", params)

  try {
    connectToDatabase()

    const { query, type } = params
    let results = []

    // if there is type, return top 8 results of that type
    const regexQuery = { $regex: query, $options: "i" }

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ]

    if (!type || !SearchableTypes.includes(type)) {
      // search all types
      // node: whenever async/await inside forEach, should stop doing that!!!
      // alternative: use for...of
      // or use Promise.all(items.map(async item => await doSomething(item))
      //   modelsAndTypes.forEach(async (item) => {
      //     const queryResult = await item.model.find()
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2)

        console.log(`${type} queryResults: ${queryResults}`)

        results.push(
          ...queryResults.map((item: any) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item._id,
          }))
        )
      }
    } else {
      // search for specific type
      const modelInfo = modelsAndTypes.find((item) => item.type === type)

      if (!modelInfo) {
        throw new Error("Invalid search type")
      }

      const { model, searchField } = modelInfo
      const queryResults = await model
        .find({ [searchField]: regexQuery })
        .limit(8)

      results = queryResults.map((item) => ({
        title:
          type === "answer" ? `Answers containing ${query}` : item[searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item._id,
      }))
    }

    return JSON.stringify(results)
  } catch (error) {
    console.log(error)
  }
}
