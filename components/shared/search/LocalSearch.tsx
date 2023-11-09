"use client"

import { Input } from "@/components/ui/input"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"

type CustomInputProps = {
  route: string
  iconPostion: string
  imgSrc: string
  placeholder: string
  otherClasses: string
}

const LocalSearch = ({
  route,
  iconPostion,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const query = searchParams.get("q")
  const [search, setSearch] = useState(query || "")
  // console.log("debug query: ", query)

  useEffect(() => {
    // debounce, to delay the execution of the search function when user is typing
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          // only change the param related to this serach, keep other existing params
          params: searchParams.toString(),
          key: "q",
          value: search,
        })

        router.push(newUrl, { scroll: false })
      } else {
        // console.log(pathname, route)
        if (pathname === route) {
          // what is the use of this if statement

          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
          })
          router.push(newUrl, { scroll: false })
        }
      }

      return () => clearTimeout(delayDebounceFn)
    }, 500)
  }, [search, router, searchParams, pathname, route])
  // }, [search, route, pathname, router, serachParams, query])

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const search = e.currentTarget.search as HTMLInputElement
  //   const newParams = new URLSearchParams(searchParams.toString())

  //   if (search.value) {
  //     newParams.set("q", search.value)
  //   } else {
  //     newParams.delete("q")
  //   }

  //   router.push(`${route}?${newParams.toString()}`)
  // }

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
        <Input
          type="text"
          name="search"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          //   onChange={() => {}}
          autoComplete="off"
          // defaultValue={searchParams?.get("q") || ""}
          className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none text-dark400_light700 placeholder:!text-slate-600"
        />

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
