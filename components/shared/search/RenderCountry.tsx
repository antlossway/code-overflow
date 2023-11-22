// a small component with fully rounded corners, content is a flag and acronym for country

import Image from "next/image"
import React from "react"

type props = {
  flag: string
  location: string
}
const RenderCountry = ({ flag, location }: props) => {
  return (
    <div className="px-4 py-2 flex items-center gap-1 rounded-full background-light800_dark400 text-dark-200 dark:text-light-700">
      <Image
        src={flag}
        alt="country flag"
        width={20}
        height={20}
        className="w-4 h-4 rounded-full"
      />
      <span className="small-regular">{location}</span>
    </div>
  )
}

export default RenderCountry
