import { rightSideBarList, rightSideBarTags } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const RightSideBar = () => {
  return (
    <aside className="sticky right-0 top-0 h-screen flex flex-col max-xl:hidden lg:w-[330px] overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none background-light900_dark200 light-border custom-scrollbar">
      <div>
        <h3 className="h3-bold text-dark200_light900 mb-7">Hot Network</h3>
        <ul className="space-y-6">
          {rightSideBarList.map((item) => (
            <li key={item._id}>
              <Link
                href={`/questions/${item._id}`}
                className="flex items-center justify-between gap-7 cursor-pointer"
              >
                <p className="body-regular text-dark500_light700">
                  {item.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  width={20}
                  height={20}
                  alt="chevron right"
                  className="invert dark:invert-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 mb-7">Popular Tags</h3>
        <ul className="space-y-6">
          {rightSideBarTags.map((item) => (
            <RenderTag
              key={item._id}
              _id={item._id}
              name={item.name}
              count={item.count}
              showCount={true}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RightSideBar;
