import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  const { question } = await request.json()
  console.log("simulate chatgpt api call")
  // simulate a delay of 5 second before returning NextResponse including {reply:"some content"} to client
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log("simulate chatgpt api response")
      resolve(NextResponse.json({ reply: "here is a new Answer" }))
    }, 2000)
  })
  // try {
  //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //     },
  //     body: JSON.stringify({
  //       model: "gpt-3.5-turbo",
  //       messages: [
  //         {
  //           role: "system",
  //           content:
  //             "You are a knowlegeable assistant that provides quality information.",
  //         },
  //         {
  //           role: "user",
  //           content: `Tell me ${question}`,
  //           // content: "what is the best programming language?",
  //         },
  //       ],
  //     }),
  //   })

  //   const responseData = await response.json()
  //   const reply = responseData.choices[0].message.content
  //   // console.log("chatgpt api response: ", reply)

  //   return NextResponse.json({ reply })
  // } catch (error: any) {
  //   console.error(error)
  //   return NextResponse.json({ error: error.message })
  // }
}
