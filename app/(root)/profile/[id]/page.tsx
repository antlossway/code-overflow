import { getUserInfo } from "@/lib/actions/user.action"
import Image from "next/image"
import React from "react"
import { getJoinedDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { URLProps } from "@/types"
import { SignedIn, auth } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileLink from "@/components/shared/ProfileLink"
import Stats from "@/components/shared/Stats"
import QuestionTab from "@/components/shared/QuestionTab"
import AnswersTab from "@/components/shared/AnswersTab"

const ProfilePage = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth() // this is currently loggined in user
  // params.id is the user id of the profile page we are visiting
  const result = await getUserInfo({ userId: params.id })
  // console.log("debug profile page: ", result)

  return (
    <div className="p-2 w-full">
      <div className=" flex flex-col-reverse gap-4 justify-between sm:flex-row ">
        {/* header */}

        <div className="flex flex-col items-start gap-4 lg:flex-row xl:flex-col ">
          <Image
            src={result.user.picture}
            width={140}
            height={140}
            alt="user avatar"
            className="rounded-full object-cover"
          />
          {/* rightside userinfo */}
          {/* name, username */}
          <div className="space-y-2">
            <h2 className="h2-bold text-dark100_light900">
              {result.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{result.user.username}
            </p>
            {/* bio */}
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {result.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={result.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {result.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={result.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(result.user.joinedAt)}
              />
            </div>
            {result.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {result.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex jusitfy-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === result.user.clerkId && (
              <Link href={`/profile/edit`} className=" flex justify-end ">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      {/* stats */}
      {/* <Stats result={result} /> */}
      <Stats
        reputation={result.reputation}
        totalQuestions={result.totalQuestions}
        totalAnswers={result.totalAnswers}
        badges={result.badgeCounts}
      />

      {/* tabs */}
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              userId={result.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswersTab
              searchParams={searchParams}
              userId={result.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfilePage
