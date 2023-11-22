import React from "react"
import Link from "next/link"
import Metric from "../shared/Metric"
import Image from "next/image"
import RenderCountry from "../shared/search/RenderCountry"

const JobLink = ({ url }: { url: string }) => {
  return (
    // text with a arrow icon on the right side
    <Link
      href={url}
      target="_blank"
      className="text-primary-500 flex items-center justify-center "
    >
      <span className="body-regular">View Job</span>
      <Image
        src="/assets/icons/arrow-up-right.svg"
        width={20}
        height={20}
        alt="arrow right icon"
        className="object-contain"
      />
    </Link>
  )
}

type JobCardProps = {
  logo: string
  title: string
  type: string // fulltime, parttime, contract
  desc: string
  salary: string // number or "Not disclosed"
  flag: string // country flag
  location: string
  url: string // "view job" link to the url
}
const JobCard = ({
  logo,
  title,
  type,
  desc,
  salary,
  location,
  url,
  flag,
}: JobCardProps) => {
  // console.log("debug clerkId vs author.clerkId: ", clerkId, author.clerkId);

  return (
    <div className="card-wrapper rounded-lg p-6 sm:px-11 ">
      {/* createdAt and Title */}
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
        {/* mobile device, location appear on right upper corner */}
        <div className="px-4 py-2 sm:hidden self-end rounded-full">
          <RenderCountry flag={flag} location={location} />
        </div>

        {/* Job logo */}
        <div className="flex-shrink-0">
          <Image
            src={logo}
            alt="job logo"
            width={30}
            height={30}
            className="w-16 h-16 rounded-md object-contain"
          />
        </div>

        <div className="w-full flex-1 ">
          {/* Job title, description */}
          <div className="flex flex-col flex-1 text-dark200_light900 gap-2">
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between">
              <h3 className="base-semibold sm:h3-semibold  line-clamp-1 ">
                {title}
              </h3>
              <div className="hidden sm:block w-fit">
                <RenderCountry flag={flag} location={location} />
              </div>
            </div>
            <p className="body-regular line-clamp-3">{desc}</p>
          </div>

          {/* job type, salary and job link */}
          <div className="mt-6 w-full flex justify-between flex-wrap gap-4 ">
            <div className="flex items-center gap-2">
              <Metric
                imgUrl="/assets/icons/clock.svg"
                alt="clock icon"
                value=""
                title={type}
                textStyles="body-medium text-light-500  rounded-md uppercase"
              />

              <Metric
                imgUrl="/assets/icons/currency-dollar-circle.svg"
                alt="currency icon"
                value=""
                title={salary}
                textStyles="body-medium text-light-500  rounded-md capitalize "
              />
            </div>

            {/* job link */}
            <JobLink url={url} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard
