"use client"
import React from "react"
import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"

type Props = {
  pageNumber: number
  isNext: boolean
}
const Pagination = ({ pageNumber, isNext }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  //   console.log(`currentPage: ${currentPage}, totalPages: ${totalPages}`)

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "next" ? pageNumber + 1 : pageNumber - 1

    if (nextPageNumber === 1) {
      // if we are on the first page, we don't need to add the page param to the url
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ["page"],
      })
      router.push(newUrl, { scroll: false })
      return
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    })
    router.push(newUrl, { scroll: false })
  }

  // if there is no next page and we are on the first page(which means there is no "Prev"), don't show pagination
  if (!isNext && pageNumber === 1) return null

  return (
    <div className="w-full flex items-center justify-center gap-2">
      <Button
        className="light-border-2 btn min-h-[36px] flex items-center justify-center gap-2 border "
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>

      <div className="bg-primary-500 px-3.5 py-2 rounded-md  text-white flex items-center justify-center">
        <p className="">{pageNumber}</p>
      </div>

      <Button
        className="light-border-2 btn min-h-[36px] flex items-center justify-center gap-2 border "
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  )
}

export default Pagination
