"use client"
import React from "react"
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

type Props = {
  filters: {
    name: string
    value: string
  }[]
  otherClasses?: string
  containerClasses?: string
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

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
      key: "filter",
      value: filter,
    })
    router.push(newUrl, { scroll: false })
  }

  return (
    <>
      <div className={`relative ${containerClasses}`}>
        <Select
          defaultValue={searchParams.get("filter") || ""}
          onValueChange={handleUpdateFilter}
        >
          <SelectTrigger
            className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
          >
            <div className="line-clamp-1 flex-1 text-left">
              <SelectValue placeholder="Select a filter" />
            </div>
          </SelectTrigger>
          <SelectContent className="">
            <SelectGroup>
              {filters.map((filter) => (
                <SelectItem
                  value={filter.value}
                  key={filter.name}
                  className=" p-4 capitalize"
                >
                  {filter.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export default Filter
