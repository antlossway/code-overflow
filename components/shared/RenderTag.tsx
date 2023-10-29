import Link from "next/link"
import React from "react"
import { Badge } from "@/components/ui/badge"

type Props = {
  _id: string
  name: string
  count?: number
  showCount?: boolean
}
const RenderTag = ({ _id, name, count, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex items-center justify-between ">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 px-4 py-2 rounded-md uppercase ">
        {name}
      </Badge>

      {showCount && <span className="small-medium dark:invert">{count}</span>}
    </Link>
  )
}

export default RenderTag
