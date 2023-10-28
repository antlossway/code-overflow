import Profile from "@/components/forms/Profile"
import React from "react"
import { auth } from "@clerk/nextjs"
import { getUserById } from "@/lib/actions/user.action"

const EditProfilePage = async () => {
  const { userId } = auth()
  if (!userId) return null

  const user = await getUserById({ userId })
  //   console.log({ userDetail });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(user)} />
      </div>
    </div>
  )
}

export default EditProfilePage
