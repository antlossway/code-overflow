"use client";
import Home from "@/app/(root)/(home)/page";
import React from "react";
import { Button } from "../ui/button";
import { HomePageFilters } from "@/context/filters";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-10 hidden md:flex flex-wrap gap-3 ">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-ligth-500 hover:bg-light-900 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-500"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
