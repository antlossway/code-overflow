import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string"
import { BADGE_CRITERIA } from "@/constants"
import { BadgeCounts, SearchParamsProps } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()
  return `${month} ${year}`
}
export const getTimesAgo = (createdAt: Date): string => {
  const now = new Date()
  const timeDifferenceInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  )

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} seconds ago`
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (timeDifferenceInSeconds < 2592000) {
    // Approximately 30 days
    const days = Math.floor(timeDifferenceInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else if (timeDifferenceInSeconds < 31536000) {
    // Approximately 365 days
    const months = Math.floor(timeDifferenceInSeconds / 2592000)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 31536000)
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}

export const formatBigNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}

interface UrlQueryParams {
  params: string
  key: string
  value: string
  baseUrl?: string
}
export const formUrlQuery = ({
  params,
  key,
  value,
  baseUrl,
}: UrlQueryParams) => {
  const currentQs = qs.parse(params)
  currentQs[key] = value
  return qs.stringifyUrl(
    {
      url: baseUrl || window.location.pathname,
      query: currentQs,
    },
    { skipNull: true }
  )
}

export const formJobUrlQuery = ({ searchParams }: SearchParamsProps) => {
  const q = searchParams.q || "web developer"
  const location = searchParams.location || "Thailand"
  // get page number, each page has up to 10 jobs
  const page = searchParams?.page ? +searchParams.page : 1
  const numPages = searchParams?.num_pages ? +searchParams.num_pages : 2 // 2 pages for testing
  const baseUrl = "https://jsearch.p.rapidapi.com/search"
  const queryString = `${q} ${location ? "in " + location : ""}`
  return qs.stringifyUrl({
    url: baseUrl,
    query: {
      query: queryString,
      page,
      num_pages: numPages,
    },
  })
}

interface RemoveKeysFromQueryParams {
  params: string
  keys: string[]
}
export const removeKeysFromQuery = ({
  params,
  keys,
}: RemoveKeysFromQueryParams) => {
  const currentQs = qs.parse(params)
  keys.forEach((key) => {
    delete currentQs[key]
  })
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentQs,
    },
    { skipNull: true }
  )
}

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA
    count: number
  }[]
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  }

  const { criteria } = params
  criteria.forEach((item) => {
    const { type, count } = item
    const badgeLevels: any = BADGE_CRITERIA[type]

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1
      }
    })
  })
  return badgeCounts
}
