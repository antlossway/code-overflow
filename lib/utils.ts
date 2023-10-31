import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "query-string"

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
}
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentQs = qs.parse(params)
  currentQs[key] = value
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentQs,
    },
    { skipNull: true }
  )
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
