import LocalSearch from "@/components/shared/search/LocalSearch";
// import NoResult from "@/components/shared/search/NoResult";
import { TagFilters } from "@/context/filters";
// import { getUsers } from "@/lib/actions/question.action";
import React from "react";
import Filter from "@/components/shared/Filter";
import { getAllTags } from "@/lib/actions/tag.action";
import NoResult from "@/components/shared/search/NoResult";
import TagCard from "@/components/cards/TagCard";

const TagsPage = async () => {
  const result = (await getAllTags({})) || { tags: [] };
  console.log("debug community getTags: ", result.tags);

  return (
    <>
      {/* heading */}
      <div className="background-light850_dark100 ">
        <h1 className="h1-bold text-dark100_light900">Tags</h1>
      </div>

      {/* search tag */}
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPostion="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />
        {/* Filters, in smaller screen, it's a selection appear on the right side of question search */}
        {/* TODO, when selected, the selected icon should be on the rightside */}
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          //   containerClasses="max-md:flex"
        />
      </div>

      {/* Tags */}
      <section className="mt-11 flex flex-wrap gap-4  ">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResult
            title="No Tags Found"
            desc="It looks like there are no tags available at the moment. 😕 Be a trendsetter by asking a question and creating a tag that best represents your topic of interest. 🚀 "
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>
    </>
  );
};

export default TagsPage;