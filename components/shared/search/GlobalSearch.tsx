"use client"
import { Input } from "@/components/ui/input"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import GlobalResult from "./GlobalResult"

const GlobalSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const query = searchParams.get("q") // local search query
  const [search, setSearch] = useState(query || "")
  const [isOpen, setIsOpen] = useState(false) // open the search result dropdown
  // console.log("debug query: ", query)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      // when click outside the div
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setSearch("")
      }
    }

    setIsOpen(false) // close the search result dropdown when pathname change

    document.addEventListener("click", handleOutsideClick)

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [pathname])

  useEffect(() => {
    // debounce, to delay the execution of the search function when user is typing
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          // only change the param related to this serach, keep other existing params
          params: searchParams.toString(),
          key: "global",
          value: search,
        })

        router.push(newUrl, { scroll: false })
      } else {
        // if (query) {
        // if there is existing local query, remove global search param
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keys: ["global", "type"],
        })
        router.push(newUrl, { scroll: false })
        // }
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [search, router, searchParams, pathname, query])

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex grow items-center gap-1 min-h-[56px] rounded-xl px-4 border border-red-500">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!isOpen) setIsOpen(true) // open the search result dropdown
            if (e.target.value === "" && isOpen) setIsOpen(false) // close the search result dropdown
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 background-light800_darkgradient border-none shadow-none outline-none "
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  )
}

export default GlobalSearch
