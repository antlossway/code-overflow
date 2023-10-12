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

mongoose: mongodb object modeling for node.js

### $setOnInsert

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

### $push

used to add an element to an array field within a document

```
    // update question to include the tags
    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: { $each: tagDocuments },
      },
    });
```

## clert authentication

## shadcn UI

Gotcha:

> tailwind.config.ts will be overridden.
> now sure if it works out of box when "src" dir is activated

## Form with Zod

## Next.js features that's new to me

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

## tailwind and CSS

### responsive

[https://tailwindcss.com/docs/responsive-design](https://tailwindcss.com/docs/responsive-design)

`max-sm` means `@media not all and (min-width: 640px) {...`

the "not" negate all the stuff after it, so it means **"not (all and (min-width:640px))"**, effectively means **for screens smaller than 640px**
The CSS syntax is mind-bending, why not using `@media all and (max-width:640px)` instead?
Anyway, hopefully the `max-sm` is straight-forward name.

### line clamp

`line-clamp-3` limit content to show 3 lines, remain represent with "..."

## Form (shacn)

## TinyMCE: library to make rich text editor
