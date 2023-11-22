"use client"
import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery } from "@/lib/utils"

import { MapPin } from "lucide-react"

type Props = {
  filters: string[]
  otherClasses?: string
  containerClasses?: string
}

const JobFilter = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ip, setIP] = useState("")

  // get client's IP
  useEffect(() => {
    const getIP = async () => {
      const res = await fetch("/api/ip")
      const data = await res.json()
      // console.log("clientIP: ", data.ip)
      setIP(data.ip)
    }
    getIP()
  }, [ip])

  // const [filter, setFilter] = useState(searchParams.get("filter") || "")
  // useEffect(() => {
  //   // console.log("filter: ", filter)
  //   // update URL
  //   if (filter) {
  //     const newUrl = formUrlQuery({
  //       // only change the param related to this serach, keep other existing params
  //       params: searchParams.toString(),
  //       key: "filter",
  //       value: filter,
  //     })
  //     router.push(newUrl, { scroll: false })
  //   }
  // }, [filter, router, searchParams])

  const handleUpdateFilter = (filter: string) => {
    const newUrl = formUrlQuery({
      // only change the param related to this serach, keep other existing params
      params: searchParams.toString(),
      key: "location",
      value: filter,
    })
    router.push(newUrl, { scroll: false })
  }

  return (
    <>
      <div className={`relative ${containerClasses}`}>
        <span className="text-dark-100 dark:text-light-400">
          clientIP: {ip}
        </span>
        <Select
          defaultValue={searchParams.get("filter") || ""}
          onValueChange={handleUpdateFilter}
        >
          <SelectTrigger
            className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
          >
            <MapPin className="h-4 w-4 opacity-50 mr-2" />

            <div className="line-clamp-1 flex-1 text-left">
              <SelectValue placeholder="Select a filter" />
            </div>
          </SelectTrigger>
          <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300 overflow-y-auto max-h-[20rem] ">
            <SelectGroup>
              {filters.map((filter) => (
                <SelectItem
                  value={filter}
                  key={filter}
                  className=" cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400 max-w-[30ch]"
                >
                  {filter}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export default JobFilter
