import React from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type TagCardProps = {
  tag: {
    _id: string
    name: string
    description?: string
    questions: {
      _id: string
      title: string
    }[]
  }
}

const TagCard = async ({ tag }: TagCardProps) => {
  return (
    <Link
      href={`/tags/${tag._id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      {/* avatar, name, username */}
      <div className="background-light900_dark200 light-border w-full flex flex-col gap-4 items-start justify-center rounded-2xl border p-8 ">
        {/* tag button */}
        <Badge className=" background-light800_dark300 text-dark100_light900 px-4 py-2 rounded-md uppercase paragraph-semibold ">
          {tag.name}
        </Badge>
        {/* tag description */}
        <p className="small-regular">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          facilis facere odio non ullam eligendi fugit itaque aliquam optio.
          Facilis!
        </p>
        <div className="space-x-2">
          <span className="body-regular text-primary-500">
            {tag.questions.length}+
          </span>
          <span className="small-regular">{` Questions`}</span>
        </div>
      </div>
    </Link>
  )
}

export default TagCard
