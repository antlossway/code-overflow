"use client"

import { GlobalSearchFilters } from "@/context/filters"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"

const GlobalFilters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type")

  const [active, setActive] = useState(type || "")

  const handleTypeClick = (type: string) => {
    if (active === type) {
      setActive("")

      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["type"],
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(type)

      const newUrl = formUrlQuery({
        // only change the param related to this serach, keep other existing params
        params: searchParams.toString(),
        key: "type",
        value: type.toLowerCase(),
      })
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="flex justify-start items-center gap-5 px-5">
      <span className="text-dark400_light900 body-medium">Type: </span>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500
        ${
          active === item.value
            ? "bg-primary-500 text-light-900"
            : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 "
        }`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilters
