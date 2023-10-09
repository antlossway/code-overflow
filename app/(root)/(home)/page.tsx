import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import LocalSearch from "@/components/shared/search/LocalSearch";
import NoResult from "@/components/shared/search/NoResult";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/context/filters";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

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

const questions = [
  {
    _id: 1,
    title: "How to use the new feature?",
    tags: [
      { _id: "1", name: "react.js" },
      { _id: "2", name: "redux" },
    ],
    author: {
      _id: 1,
      name: "John Doe",
      picture: "url_to_picture",
    },
    upvotes: 100_000_000,
    views: 200_000_123,
    answers: [
      {
        /* Specify the structure of an answer object */
      },
    ],
    createdAt: new Date("2023-09-01T00:00:00.000Z"),
  },
  {
    _id: 2,
    title: "How to use the new feature? we need to be able to use it",
    tags: [
      { _id: "1", name: "react.js" },
      { _id: "2", name: "redux" },
    ],
    author: {
      _id: 1,
      name: "John Doe",
      picture: "url_to_picture",
    },
    upvotes: 10,
    views: 200,
    answers: [
      {
        /* Specify the structure of an answer object */
      },
    ],
    createdAt: new Date("2021-09-01T00:00:00.000Z"),
  },
  {
    _id: 3,
    title: "How to use the new feature?",
    tags: [
      { _id: "1", name: "react.js" },
      { _id: "2", name: "redux" },
    ],
    author: {
      _id: 1,
      name: "John Doe",
      picture: "url_to_picture",
    },
    upvotes: 10,
    views: 200,
    answers: [
      {
        /* Specify the structure of an answer object */
      },
    ],
    createdAt: new Date("2021-09-01T00:00:00.000Z"),
  },
];
export default function Home() {
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
        {questions.length > 0 ? (
          questions.map((question) => (
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
