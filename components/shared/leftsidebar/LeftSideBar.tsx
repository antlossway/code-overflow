"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="flex flex-1 flex-col gap-6">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <Link
            key={item.route}
            href={item.route}
            className={`${
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900 "
            } flex items-center justify-start gap-4 bg-transparent p-4`}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={`${isActive ? "" : "invert-colors"}`}
            />
            <p
              className={`${
                isActive ? "base-bold" : "base-medium"
              } max-lg:hidden `}
            >
              {item.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};
const LeftSideBar = () => {
  return (
    <aside className="sticky left-0 top-0 h-screen flex flex-col justify-between max-sm:hidden lg:w-[266px] overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none background-light900_dark200 light-border custom-scrollbar">
      {/* <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="Code Overflow"
        />
        <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
          Dev <span className="text-primary-500">Overflow</span>
        </p>
      </Link> */}

      <div className="h-full flex flex-col  ">
        <NavContent />

        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in">
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none flex justify-center items-center gap-4">
                <Image
                  src="/assets/icons/account.svg"
                  width={20}
                  height={20}
                  alt="login"
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Log In
                </span>
              </Button>
            </Link>

            <Link href="/sign-up">
              <Button className="small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-dark400_light900 flex justify-center items-center gap-4">
                <Image
                  src="/assets/icons/sign-up.svg"
                  width={20}
                  height={20}
                  alt="sign up"
                  className="invert-colors lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Button>
            </Link>
          </div>
        </SignedOut>
      </div>
    </aside>
  );
};

export default LeftSideBar;
