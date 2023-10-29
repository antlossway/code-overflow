"use client"

import { Input } from "@/components/ui/input"
import Image from "next/image"
import React from "react"
import { useRouter, useSearchParams } from "next/navigation"

type CustomInputProps = {
  route: string
  iconPostion: string
  imgSrc: string
  placeholder: string
  otherClasses: string
  path: string
}

const LocalSearch = ({
  route,
  iconPostion,
  imgSrc,
  placeholder,
  otherClasses,
  path,
}: CustomInputProps) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const search = e.currentTarget.search as HTMLInputElement
    const newParams = new URLSearchParams(searchParams.toString())

    if (search.value) {
      newParams.set("q", search.value)
    } else {
      newParams.delete("q")
    }

    router.push(`${path}?${newParams.toString()}`)
  }

  return (
    <div className="relative w-full ">
      <div
        className={`background-light800_darkgradient relative flex grow items-center gap-1 min-h-[56px] rounded-xl px-4 ${otherClasses}`}
      >
        {iconPostion === "left" && (
          <Image
            src={imgSrc}
            alt="Search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
        <form onSubmit={onSubmit}>
          <Input
            type="text"
            name="search"
            placeholder={placeholder}
            value={searchTerm}
            //   onChange={() => {}}
            autoComplete="off"
            defaultValue={searchParams?.get("q") || ""}
            className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none text-dark400_light700 placeholder:!text-slate-600"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {iconPostion === "right" && (
          <Image
            src={imgSrc}
            alt="Search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  )
}

export default LocalSearch
