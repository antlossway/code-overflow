"use client"
import React, { useRef, useState } from "react"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Editor } from "@tinymce/tinymce-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionsSchema } from "@/lib/validations"
import { Badge } from "../ui/badge"
import Image from "next/image"
import { createQuestion, editQuestion } from "@/lib/actions/question.action"
// import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "@/context/ThemeProvider"

// const QuestionsSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// });
interface Props {
  mongoUserId: string
  type?: string
  questionDetails?: string
}
const Question = ({ mongoUserId, type = "Create", questionDetails }: Props) => {
  const { mode } = useTheme()
  const editorRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const parsedQuestionDetails = questionDetails
    ? JSON.parse(questionDetails)
    : ""
  const groupedTags = parsedQuestionDetails?.question?.tags?.map(
    (tag: any) => tag.name
  )

  if (type === "Edit" && questionDetails) {
    // check if author of the question is the same as the current user
    // if not, redirect to home page
    if (
      JSON.parse(mongoUserId) !==
      JSON.parse(questionDetails).question.author._id
    ) {
      // console.log(
      //   "#### Question: not the same author, ",
      //   mongoUserId,
      //   " vs ",
      //   JSON.parse(questionDetails).question.author._id
      // );
      router.push("/")
    }
  }

  // const { user } = useUser();

  // 1. Define a form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails?.question?.title || "",
      explanation: parsedQuestionDetails?.question?.explanation || "",
      tags: groupedTags || [],
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsSubmitting(true)
    try {
      if (type === "Edit") {
        // edit question
        await editQuestion({
          ...values,

          path: pathname,
          questionId: parsedQuestionDetails.question._id,
        })

        // console.log("edit question");
        router.push(`/question/${parsedQuestionDetails.question._id}`)
      } else {
        // create question, make an async call to our API
        // contain all form data
        await createQuestion({
          // ...values,
          title: values.title,
          explanation: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname, // '/' home page
        })
        router.push("/")
      }

      // navigate to home page
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  {...field}
                  className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you’re asking a question to another
                person.
              </FormDescription>
              {/* for error message */}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explantions of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* rich text editor */}
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) =>
                    // @ts-ignore
                    (editorRef.current = editor)
                  }
                  onBlur={field.onBlur} // save the value once we exit the editor
                  onEditorChange={(content) => field.onChange(content)}
                  // initialValue="<p>This is the initial content of the editor.</p>"
                  initialValue={
                    parsedQuestionDetails?.question?.explanation || ""
                  }
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo |  " +
                      "codesample | bold italic backcolor | alignleft aligncenter | " +
                      "alignright alignjustify | bullist numlist ",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>

              {/* for error message */}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && field.name === "tags") {
                        e.preventDefault()
                        // @ts-ignore
                        const tagValue = e.target.value.trim()
                        // max 3 tags
                        if (tagValue !== "" && field.value.length < 3) {
                          if (tagValue.length > 15) {
                            return form.setError("tags", {
                              type: "max",
                              message: "Tag must be less than 15 characters.",
                            })
                          }
                          //  check if tag already exists
                          if (!field.value.includes(tagValue as never)) {
                            form.setValue("tags", [...field.value, tagValue])
                            // @ts-ignore
                            e.target.value = ""
                            form.clearErrors("tags")
                          }
                        } else {
                          // input is empty
                          form.trigger()
                        }
                      }
                    }}
                    placeholder="Add tags..."
                    className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2 5 gap-2 5">
                      {field.value.map((tag, index) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() => {
                            // remove tag
                            form.setValue(
                              "tags",
                              field.value.filter((t: string) => t !== tag)
                            )
                          }}
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags. You need to press enter to add a tag.
              </FormDescription>
              {/* for error message */}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default Question
