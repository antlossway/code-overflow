import JobCard from "@/components/cards/JobCard"
import JobFilter from "@/components/shared/JobFilter"
import Pagination from "@/components/shared/Pagination"
import LocalSearch from "@/components/shared/search/LocalSearch"
import NoResult from "@/components/shared/search/NoResult"
import { getCountries, getJobs } from "@/lib/actions/job.action"
import { formJobUrlQuery } from "@/lib/utils"
import { SearchParamsProps } from "@/types"
import React from "react"

// const JobData = [
//   {
//     id: 1,
//     logo: "/assets/images/amazon.webp",
//     title: "Senior Software Engineer",
//     type: "Full-time",
//     salary: "Not disclosed",
//     location: "San Francisco, CA",
//     flag: "https://flagcdn.com/us.svg",
//     url: "https://www.airbnb.com/careers/departments/position/3255855",
//   },
//   {
//     id: 2,
//     logo: "/assets/images/amazon.webp",
//     title: "Senior Software Engineer",
//     type: "Full-time",
//     salary: "Not disclosed",
//     flag: "https://flagcdn.com/us.svg",
//     location: "San Francisco, CA",
//     url: "https://www.airbnb.com/careers/departments/position/3255855",
//   },
// ]
const JobsPage = async ({ searchParams }: SearchParamsProps) => {
  const page = searchParams?.page ? +searchParams?.page : 1
  let totalPages = 2 // the totalPage is a fixed value that need to be passed to JSearch API call

  // use restcountries.com API to get list of country name and flag
  const { countryNameList, countryFlagMap } = await getCountries()

  const flag =
    countryFlagMap.get(searchParams?.location || "") ||
    "https://flagcdn.com/us.svg"
  // use JSearch API to fetch jobs
  // construct query string and full url
  const getJobsUrl = formJobUrlQuery({
    searchParams,
  })
  console.log("debug getJobsUrl: ", getJobsUrl)

  const jobs = (await getJobs({ url: getJobsUrl })) || []
  // console.log("debug jobs: ", jobs.length, jobs[0])
  if (jobs.length === 0) {
    totalPages = 0
  }

  return (
    <>
      {/* heading */}
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      </div>

      {/* search question */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/jobs"
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job Title, Company, or Keywords"
          otherClasses="flex-1"
        />
        {/* Filters, in smaller screen, it's a selection appear on the right side of question search */}
        {/* TODO, when selected, the selected icon should be on the rightside */}
        <JobFilter
          filters={countryNameList}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          // containerClasses="flex gap-1 background-light800_dark300 px-2.5 rounded-md"
        />
      </div>

      {/* job list */}
      <div className="mt-10 flex flex-col gap-4">
        {jobs.length > 0 ? (
          jobs.map((job: any) => (
            <JobCard
              key={job.job_id}
              logo={job.employer_logo || "/assets/images/amazon.webp"}
              title={job.job_title}
              desc={job.job_description || "No description"}
              type={job.job_employment_type || "Full Time"}
              salary={`${
                job.job_min_salary
                  ? `${job.job_min_salary} - ${job.job_max_salary}`
                  : "Not disclosed"
              }`}
              location={
                job.job_city
                  ? `${job.job_city}, ${job.job_country}`
                  : job.job_country
              }
              url={job.job_apply_link}
              flag={flag}
            />
          ))
        ) : (
          <NoResult
            title="No Jobs Found"
            desc="We couldn't find any jobs matching your search. Try searching with different keywords or filters."
            link="/jobs"
            linkTitle="Explore Jobs"
          />
        )}
      </div>

      {/* pagination */}
      <div className="mt-10">
        {totalPages > 1 && (
          <Pagination pageNumber={page} isNext={totalPages > page} />
        )}
      </div>
    </>
  )
}

export default JobsPage
