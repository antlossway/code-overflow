import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/shared/search/LocalSearch";
import NoResult from "@/components/shared/search/NoResult";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { IQuestion } from "@/lib/database/question.model";
import { URLProps } from "@/types";
import React from "react";

const TagDetailPage = async ({ params, searchParams }: URLProps) => {
  const { tagId } = params;
  const result = await getQuestionsByTagId({
    tagId,
    page: 1,
    searchQuery: searchParams.q,
  });
  console.log("debug getQuestionsByTagId: ", result);
  return (
    <>
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900 capitalize">
          {result.tagTitle}
        </h1>
      </div>

      {/* search tag */}
      <div className="mt-11 w-full">
        <LocalSearch
          route="/tags"
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag questions..."
          otherClasses="flex-1"
        />
      </div>

      {/* questions */}
      {/* Questions */}
      <div className="mt-11 flex w-full flex-col gap-5 ">
        {result.questions.length > 0 ? (
          result.questions.map((question: IQuestion) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="No tag questions found"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default TagDetailPage;
