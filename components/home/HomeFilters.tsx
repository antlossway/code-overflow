"use client"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { HomePageFilters } from "@/context/filters"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

const HomeFilters = () => {
  const searchParams = useSearchParams()
  const lastFilter = searchParams.get("filter")
  const [filter, setFilter] = useState(lastFilter || "")
  const router = useRouter()

  // TODO: fetch recommended

  const toggleFilter = (value: string) => {
    if (filter === value) {
      // if the filter is already selected, then remove it
      setFilter("")
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["filter"],
      })
      router.push(newUrl, { scroll: false })
    } else {
      setFilter(value)
      const newUrl = formUrlQuery({
        // only change the param related to this serach, keep other existing params
        params: searchParams.toString(),
        key: "filter",
        value,
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="mt-10 hidden md:flex flex-wrap gap-3 ">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => toggleFilter(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            filter === item.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-ligth-500 hover:bg-light-900 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-500"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  )
}

export default HomeFilters
