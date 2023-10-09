import React from "react";
import RenderTag from "../shared/RenderTag";
import Image from "next/image";
import Link from "next/link";
import Metric from "../shared/Metric";
import { formatBigNumber, getTimesAgo } from "@/lib/utils";

type QuestionCardProps = {
  _id: number;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: number;
    name: string;
    picture: string;
  };
  upvotes: number;
  answers: Array<object>;
  views: number;
  createdAt: Date;
};
const QuestionCard = ({ question }: { question: QuestionCardProps }) => {
  return (
    <div className="card-wrapper p-6 sm:px-11 rounded-lg ">
      {/* createdAt and Title */}
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          {/* on mobile device, createdAt date is on top */}
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimesAgo(question.createdAt)}
          </span>
          <Link href={`/question/${question._id}`}>
            <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question.title}
            </h3>
          </Link>
        </div>
        {/* TODO: if signed in, add edit/delete action */}
      </div>

      {/* tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTag key={tag.name} _id={tag._id} name={tag.name} />
        ))}
      </div>

      {/* author and statistics */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          // imgUrl={question.author.picture}
          imgUrl="/assets/icons/avatar.svg"
          alt="user"
          value={question.author.name}
          title={` - asked ${getTimesAgo(question.createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${question.author._id}`}
          isAuthor={true}
        />

        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="upvotes"
          value={formatBigNumber(question.upvotes)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="messages"
          value={formatBigNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatBigNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;