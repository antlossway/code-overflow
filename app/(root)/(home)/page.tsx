import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import NoResult from "@/components/shared/search/NoResult";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/context/filters";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getQuestions } from "@/lib/actions/question.action";
import { IQuestion } from "@/lib/database/question.model";

const filterOptions = [
  {
    _id: 1,
    value: "newest",
  },
  {
    _id: 2,
    value: "recommended",
  },
  {
    _id: 3,
    value: "frequent",
  },
  {
    _id: 4,
    value: "unanswered",
  },
];

export default async function Home() {
  const result = await getQuestions({});
  console.log("debug getQuestions ", result);

  return (
    <>
      {/* heading with a button */}
      <div className="flex flex-col-reverse justify-between gap-4 w-full sm:flex-row sm:items-center background-light850_dark100">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-light-900">
            Ask a question
          </Button>
        </Link>
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

      {/* Filters, in larger screen will appear below the question search as Tags */}
      <HomeFilters />

      {/* Questions */}
      <div className="mt-11 w-full flex flex-col gap-5 ">
        {result.questions.length > 0 ? (
          result?.questions.map((question) => (
            <QuestionCard key={question.title} question={question} />
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
