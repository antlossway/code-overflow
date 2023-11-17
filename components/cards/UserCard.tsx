import Image from "next/image"
import React from "react"
import { Badge } from "@/components/ui/badge"
import RenderTag from "../shared/RenderTag"
import Link from "next/link"
import { getTopInteractedTags } from "@/lib/actions/tag.action"

type UserCardProps = {
  user: {
    _id: string
    clerkId: string
    name: string
    username: string
    tags: {
      _id: string
      name: string
    }[]
    picture: string
  }
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id })
  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      {/* avatar, name, username */}
      <article className="background-light900_dark200 light-border w-full flex flex-col items-center justify-center rounded-2xl border p-8 ">
        <Link href={`/profile/${user.clerkId}`}>
          <Image
            src={user.picture}
            alt={`${user.name} avatar`}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1 ">
              {user.name}
            </h3>
            <span className="body-regular text-dark500_light500 mt-2 text-center">
              @{user.username}
            </span>
          </div>
        </Link>

        {/* tags */}
        <div className="mt-3.5 ">
          {interactedTags.length > 0 ? (
            <div className="flex justify-center items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag
                  key={tag.name}
                  _id={tag._id}
                  name={`${tag.name.slice(0, 4)}..`}
                />
              ))}
            </div>
          ) : (
            <Badge className=" subtle-medium background-light800_dark300 text-light400_light500 px-4 py-2  rounded-md uppercase ">
              no tags yet
            </Badge>
          )}
        </div>
      </article>
    </div>
  )
}

export default UserCard
