import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatBigNumber, getTimesAgo } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type QuestionParams = {
  params: {
    questionId: string;
  };
};
const QuestionDetail = async ({ params }: QuestionParams) => {
  const { questionId } = params;
  const result = (await getQuestionById({ questionId })).question || {};
  // console.log("debug question detail: ", result);

  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId: clerkId });
  // console.log(`debug clerkId: ${clerkId}, mongoUser ${mongoUser}`);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="user avatar"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>

          <div className="flex justify-end">
            <Votes
              type="Question"
              id={JSON.stringify(questionId)}
              voteUserId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              downvotes={result.downvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id) || false}
              hasdownVoted={result.downvotes.includes(mongoUser._id) || false}
              hasSaved={mongoUser?.savedPosts?.includes(questionId) || false}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      {/* metric */}
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimesAgo(result.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="messages"
          value={formatBigNumber(result.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatBigNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      {/* question detail, using prismjs to highlight the code block, use html-react-parser for other markdown text */}
      <ParseHTML data={result.explanation} />

      {/* tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag.name}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      {/*  All existing answers */}
      <AllAnswers
        questionId={result._id}
        userId={mongoUser._id} // type is objectId, not string
        totalAnswers={result.answers.length}
      />

      {/* Answer form */}
      <Answer
        mongoUserId={JSON.stringify(mongoUser._id)}
        questionId={questionId}
      />
    </>
  );
};

export default QuestionDetail;
