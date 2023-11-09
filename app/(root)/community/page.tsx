import LocalSearch from "@/components/shared/search/LocalSearch"
// import NoResult from "@/components/shared/search/NoResult";
import { UserFilters } from "@/context/filters"
// import { getUsers } from "@/lib/actions/question.action";
import React from "react"
import Filter from "@/components/shared/Filter"
import UserCard from "@/components/cards/UserCard"
import Link from "next/link"
import { getAllUsers } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"
import Pagination from "@/components/shared/Pagination"

const pageSize = 2
const CommunityPage = async ({ searchParams }: SearchParamsProps) => {
  const page = searchParams?.page ? +searchParams.page : 1
  const result = (await getAllUsers({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page,
    pageSize,
  })) || {
    users: [],
    totalCount: 0,
  }
  // console.log("debug community getUsers: ", result.users);
  const totalPages = Math.ceil(result.totalCount / pageSize)
  const isNext = totalPages > page // is there still a next page

  return (
    <>
      {/* heading */}
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>

      {/* search question */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        {/* Filters, in smaller screen, it's a selection appear on the right side of question search */}
        {/* TODO, when selected, the selected icon should be on the rightside */}
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          //   containerClasses="max-md:flex"
        />
      </div>

      {/* Users */}
      <section className="mt-11 flex flex-wrap gap-4  ">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users yet.</p>
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join Now to be the First 🚀
            </Link>
          </div>
        )}
      </section>

      {/* Pagination */}
      <div className="mt-10 flex-center">
        <Pagination pageNumber={page} isNext={isNext} />
      </div>
    </>
  )
}

export default CommunityPage
