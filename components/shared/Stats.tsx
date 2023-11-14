import { formatBigNumber } from "@/lib/utils"
import { BadgeCounts } from "@/types"
import Image from "next/image"
import React from "react"

interface BadgeCardProps {
  title: string
  count: number
  icon: string
}
const BadgeCard = ({ title, count, icon }: BadgeCardProps) => (
  <div className="p-6 flex flex-wrap items-center justify-start gap-4 background-light900_dark300 light-border rounded-md border shadow-light-300 dark:shadow-dark-200 ">
    <Image src={icon} width={40} height={50} alt={title} />
    <div>
      <p className="paragraph-semibold text-dark200_light900">
        {formatBigNumber(count)}
      </p>
      <p className="body-medium text-dark400_light700">{title}</p>
    </div>
  </div>
)

interface Props {
  totalQuestions: number
  totalAnswers: number
  badges: BadgeCounts
  reputation: number
}
const Stats = ({ reputation, totalQuestions, totalAnswers, badges }: Props) => {
  return (
    <section className="mt-8">
      <h4 className="h3-semibold text-dark200_light900">
        Stats - {reputation}
      </h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        {/* card of question and answer  */}
        <div className="p-6 flex flex-wrap items-center justify-evenly gap-4 background-light900_dark300 light-border rounded-md border shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatBigNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatBigNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        {/* cards of badges */}
        <BadgeCard
          title="Gold Badges"
          count={badges.GOLD}
          icon="/assets/icons/gold-medal.svg"
        />

        <BadgeCard
          title="Silver Badges"
          count={badges.SILVER}
          icon="/assets/icons/silver-medal.svg"
        />

        <BadgeCard
          title="Bronze Badges"
          count={badges.BRONZE}
          icon="/assets/icons/bronze-medal.svg"
        />
      </div>
    </section>
  )
}

export default Stats
