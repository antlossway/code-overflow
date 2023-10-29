import Image from "next/image"
import Link from "next/link"
import React from "react"
import RenderTag from "./RenderTag"
import { getTopQuestions } from "@/lib/actions/question.action"
import { getPopularTags } from "@/lib/actions/tag.action"

const RightSideBar = async () => {
  const topQuestions = await getTopQuestions()
  // console.log({ topQuestions })
  if (!topQuestions) return null

  const topTags = await getPopularTags()
  // console.log({ topTags })
  return (
    <aside className="sticky right-0 top-0 h-screen flex flex-col max-xl:hidden lg:w-[330px] overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none background-light900_dark200 light-border custom-scrollbar">
      <div>
        <h3 className="h3-bold text-dark200_light900 mb-7">Top Questions</h3>
        <ul className="space-y-6">
          {topQuestions.map((item) => (
            <li key={item._id}>
              <Link
                href={`/question/${item._id}`}
                className="flex items-center justify-between gap-7 cursor-pointer"
              >
                <p className="body-regular text-dark500_light700">
                  {item.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  width={20}
                  height={20}
                  alt="chevron right"
                  className="invert dark:invert-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 mb-7">Popular Tags</h3>
        <ul className="space-y-6">
          {topTags.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.name}
              count={item.numOfQuestions}
              showCount={true}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default RightSideBar
