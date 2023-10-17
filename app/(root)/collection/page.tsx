import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import NoResult from "@/components/shared/search/NoResult";
import { HomePageFilters } from "@/context/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function CollectionPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const result = (await getSavedQuestions({ clerkId })) || { questions: [] };
  console.log("debug getSavedQuestions: ", result.questions);
  return (
    <>
      {/* heading */}
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </div>

      {/* search question */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search questions..."
          otherClasses=""
        />
        {/* Filters, in smaller screen, it's a selection appear on the right side of question search */}
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      {/* Questions */}
      <div className="mt-11 flex w-full flex-col gap-5 ">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
            title="No questions found"
            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
