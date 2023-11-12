# stackoverflow inspired project

Following JSmastery course

## Next.js server actions

run server code without having to create an API endpoint
[https://makerkit.dev/blog/tutorials/nextjs-server-actions](https://makerkit.dev/blog/tutorials/nextjs-server-actions)

to enable server action in next.js

```
// next.config.js
module.exports = {
  experimental: {
    serverActions: true,
  }
};
```

## mongo DB

### mongosh (MongoDB Shell)

```
brew install mongosh

// connect to Atlas DB
mongosh "mongodb+srv://username:password@YOUR_CLUSTER_NAME.YOUR_HASH.mongodb.net/"

// filter questions belong to a author and select only the title field
codeflow> db.questions.find({author: ObjectId("65288f20e1487081ce9ff8c3")},{title:1,_id:0})
```

### mongoose:

> Mongoose is a node.js-based Object Data Modeling(ODM) libray for MongoDB.
> It is akin to an Object Relational Mapper(ORM) for SQL databases.
> Mongoose enforce a specific schema at the application layer, and offers a variety of hooks, model validation, and other features aimed at making it easier to work with MongoDB.
> We don't have to use Mongoose, we can use MongoDB Node.js driver, it will not be aware of the object data modeling, we simply write queries against the database and collections.

#### MongoDB Object Modeling for node.js

**note** don't forget "use server" at the top of server action file, otherwise will get error like "TypeError: mongooseWEBPACK_IMPORTED_MODULE_0.models is undefined
Source

lib/database/question.model.ts (28:2) @ models

26 |
27 | const Question =
28 | models.Question || model<IQuestion>("Question", QuestionSchema);
| ^
29 | export default Question;
30 |"

```
// server actions: answer.action.ts

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });

    //   also can write like this:
    // .populate("author", "_id clerkId name picture")
```

#### embedded populate

```
    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { explanation: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {}

    const user = await User.findOne({ clerkId }).populate({
      path: "savedPosts",
      match: query,
      options: {
        sort: { createdAt: -1 },
        // paging
      },
      // embedded populate on each question
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    })
```

#### $setOnInsert

when updating a document with `findOneAndUpdate`, use `$setOnInsert` to specify fields that should be set only when a new document is created (i.e., during an `upsert` operation)

```
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
```

#### $push

used to add an element to an array field within a document

```
    // update question to include the tags
    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: { $each: tagDocuments },
      },
    });
```

#### $addToSet vs. $push

`$addToSet` do not add the item to the given field if it already contains it,
on the other hand, `$push` will add the given object to field whether it exists or not.
It seems to be that using `$addToSet` is safer?

### ObjectId vs type string

`Error: Cast to ObjectId failed for vlue "xxxxx" (type string) at path "upvotes" of "BSONError"`

Hello mentor, I'm puzzled by the type of `userId`, in "Voting" section, there are multiple places using "string" in the props, while the data retrieved from mongoDB using type "ObjectId".

example:

```
// components/shared/AllAnswers.tsx

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
}
...
const answers = await getAnswers({questionId})
console.log("debug all answers: ", answers)
...
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasupVoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasdownVoted={answer.downvotes.includes(userId)}
                  />
```

the console.log shows `upvotes: [ new ObjectId("65288f20e1487081ce9ff8c3") ],` , so I'm wondering why `answer.upvotes.includes(userId)` is true, because `userId` is string type.

in fact, when `AllAnswers` is called, we pass the userId as ObjectID, and although `AllAnswers.tsx` define Props with userId as string, it's actually still in `ObjectId`, and therefore it would match the items of upvotes array of ObjectId.

```
// @/app/(root)/question/[questionId]/page.tsx

      <AllAnswers
        questionId={result._id}
        userId={mongoUser._id} // type is objectId, not string
        totalAnswers={result.answers.length}
      />
```

### convert URL params(string type) into mongodb objectId type

** mongoose.Type.ObjectId(stringId) **

```
// tag.action.ts

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
```

### findById vs query id inside find/aggregate

`findById` can use string argument, it's very forgiving.
using`find` or `aggregate`, you have to pass ObjectId type ID.

### mongoDB aggregate

to calculate the number of savedPost of a user, need to match the userId and query

```
// user.action.ts
  const checkTotalCount = await User.aggregate([
      { $match: { $and: [{ clerkId }, query] } },
      { $project: { savedPostsCount: { $size: "$savedPosts" } } },
    ])
    const totalCount = checkTotalCount[0].savedPostsCount
```

## clert authentication

### webhook to sync user with mongoDB

1. deploy project to vercel and get the URL
2. add clerk webhook endpoint, get WEBHOOK_SECRET
3. add in .env.local NEXT_CLERK_WEBHOOK_SECRET=xxxxx, also update /api/webhook/route.ts to read from this variable

```
const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;
```

4. update /middleware.ts
   add publicRoutes and ignoredRoutes, this is to authorize clerk webhook to call action, and also allow other functions in app.

```
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/jobs",
  ],
  ignoredRoutes: ["/api/webhook", "/api/chatgpt"],
});
```

5. vercel project setting: add environment variable `NEXT_CLERK_WEBHOOK_SECRET`, redeploy

## prismjs: syntax highlighter

for code content: prismjs
for markdown content: html-react-parser

1. install prismjs and html-react-parser
2. add in @/component/shared/ParseHTML.tsx

```
// @/component/shared/ParseHTML.tsx

"use client"

// prismjs commonly used language list

import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

  useEffect(() => {
    prism.highlightAll();
  }, []);
```

3. create @/styles/prism.css to give the code block styles

```
// @app/layout.tsx

import "../styles/prism.css"
```

## shadcn UI

### Gotcha:

> tailwind.config.ts will be overridden.
> now sure if it works out of box when "src" dir is activated

### form:

under the hood using react-hook-form

**note** the FormField defined in form has be exactly match Schema that is used with `useForm`, if one field is missing, click submit button will happen nothing and no error display in browser console.

```
// @/components/forms/Answer.tsx

import { useForm } from "react-hook-form";

const form = useForm<z.infer<typeof AnswersSchema>>({
    resolver: zodResolver(AnswersSchema),
    defaultValues: {
      answer: "",
    },
  });

      // clear form state, but the editor still has the content
      form.reset();
      // clear editor
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("")
      }

```

### Select

it seems only support uncontrolled Select element.
in the `<Select></Select>` root element, use `defaultValue` and `onValueChange`.
`value` and `onChange` is not supported, so no need to use `useState` to track the value of the selection.

## Form with Zod

## Next.js features that's new to me

### URL states (debounce search)

### usePathname

### revalidatePath

allows to purge cached data on-demand for a specific path

After creating a new question, page redirect to home page, and it will query for all questions to display, so that the newly created question will appear.

```
// @lib/actions/question.action.ts

export async function createQuestion(params: CreateQuestionParams) {
    ...
        await question.save();
    console.log("new question saved to DB");
    //reload the home page to show the newly created question
    revalidatePath(path);
```

## Typescript

### two ways to define types for props

```
// page.tsx
<QuestionCard question={question}>

// QuestionCard.tsx
type QuestionCardProps = {
  title: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  askedBy: string;
};
const QuestionCard = ({ question }: { question: QuestionCardProps })

//the other way to declare type
type QuestionCardProps = {
    question: {
        title: string;
        tags: string[];
        votes: number;
        answers: number;
        views: number;
        askedBy: string;
    }
};
const QuestionCard = ({ question }: QuestionCardProps )
```

### organize types for the project

> there are server-side types

1. mongoDB schema

```
// @lib/database/question.model.ts
// 1. define an interface
// 2. define a schema
// 3. define and export model
```

2. server action params, all params's types are defined in @lib/actions/shared.types.d.ts

```
// @lib/actions/question.action.ts

import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";

export async function getQuestions(params: GetQuestionsParams) {
```

> client-side types (forms, zod validation)

```
// components/form/Questions.tsx
import { QuestionsSchema } from "@/lib/validations";

// @/lib/validations.ts
import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
```

### use ! to avoid error

username type is "string | null",
error: "Type 'string | null' is not assignable to type 'string'."

```
username: username!, // ! means we are sure that this is not null
```

### use @ts-ignore

```
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) =>
                    // @ts-ignore
                    (editorRef.current = editor)
                  }
```

### index signature

`[key: string]` means there can be unlimited key (with string type) in object searchParams.
the value will be string or undefined.
example:

```
searchParms: {
  name: "Max",
  title: "student",
  address: "xxxx",
  ....
}
```

```
export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}
```

## tailwind and CSS

### responsive

[https://tailwindcss.com/docs/responsive-design](https://tailwindcss.com/docs/responsive-design)

`max-sm` means `@media not all and (min-width: 640px) {...`

the "not" negate all the stuff after it, so it means **"not (all and (min-width:640px))"**, effectively means **for screens smaller than 640px**
The CSS syntax is mind-bending, why not using `@media all and (max-width:640px)` instead?
Anyway, hopefully the `max-sm` is straight-forward name.

### line clamp

`line-clamp-3` limit content to show 3 lines, remain represent with "..."

## TinyMCE: library to make rich text editor

## package query-string

```
npm i query-string
import qs from "query-string"
```

## javascript

### convert a string to number using unary plus operator +

```
// if there is "page" params, then turn that string into number, if not then use 1
const pageNumber = searchParams?.page ? +searchParams.page : 1
```

### never use async/await inside forEach !!!

alternative: use for...of
or use Promise.all(items.map(async item => await doSomething(item))
