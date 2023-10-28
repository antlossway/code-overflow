import { formatBigNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const badgeData = [
  {
    id: 1,
    title: "Gold Badges",
    count: 5,
    icon: "/assets/icons/gold-medal.svg",
  },
  {
    id: 2,
    title: "Silver Badges",
    count: 10,
    icon: "/assets/icons/silver-medal.svg",
  },
  {
    id: 3,
    title: "Bronze Badges",
    count: 15,
    icon: "/assets/icons/bronze-medal.svg",
  },
];
const BadgeCard = ({ title, count, icon }: any) => (
  <div className="p-6 flex flex-wrap items-center justify-start gap-4 background-light900_dark300 light-border rounded-md border shadow-light-300 dark:shadow-dark-200 ">
    <Image src={icon} width={40} height={50} alt="badge icon" />
    <div>
      <p className="paragraph-semibold text-dark200_light900">
        {formatBigNumber(count)}
      </p>
      <p className="body-medium text-dark400_light700">{title}</p>
    </div>
  </div>
);
const Stats = ({ result }) => {
  return (
    <section className="mt-8">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        {/* card of question and answer  */}
        <div className="p-6 flex flex-wrap items-center justify-evenly gap-4 background-light900_dark300 light-border rounded-md border shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatBigNumber(result.totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatBigNumber(result.totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        {/* cards of badges */}
        {badgeData.map((badge) => (
          <BadgeCard
            key={badge.id}
            title={badge.title}
            count={badge.count}
            icon={badge.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default Stats;
