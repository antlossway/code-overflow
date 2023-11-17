import RightSideBar from "@/components/shared/RightSideBar"
import LeftSideBar from "@/components/shared/leftsidebar/LeftSideBar"
import Navbar from "@/components/shared/navbar/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { auth } from "@clerk/nextjs"
import React from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth()

  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <Toaster />
      <div className="flex">
        <LeftSideBar clerkId={userId} />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          {/* <Suspense fallback={<Loading />}> */}
          <div className="mx-auto w-full max-w-5xl">{children}</div>
          {/* </Suspense> */}
        </section>

        <RightSideBar />
      </div>
    </main>
  )
}

export default Layout
